import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Product } from "./product.entity.js"
import { validateProduct } from "./product.schema.js"
import { Category } from "../Category/category.entity.js"


const em = orm.em 

async function findAll(req: Request,res: Response) { 
    try{
        const products = await em.find(Product,{}, {populate: ['category', 'reviews']});
        console.log(products);
        res.status(200).json({message: 'found all products', data: products})
    } catch (error: any){
        res.status(500).json({message: error.message})
  }}
async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    const _id = new ObjectId(id);
    const product = await em.findOne(Product, { _id }, { populate: ['category', 'reviews'] });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Found product', data: product });
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
  }
async function add(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (user.userType !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
       console.log("🧪 Body recibido:", req.body);

      const validationResult = validateProduct(req.body);
      if (!validationResult.success) {
        console.error("❌ Error de validación:", validationResult.error.format());
        return res.status(400).json({
          message: 'Invalid product data',
          errors: validationResult.error.errors,
        });
      }
  
      const categoryId = req.body.category;
      if (!categoryId || !ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: 'Invalid or missing category ID' });
      }
  
      const category = await em.findOne(Category, { _id: new ObjectId(categoryId) });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      const product = em.create(Product, req.body);
      await em.flush();
  
      return res.status(201).json({ message: 'Product created', data: product });
    } catch (error: any) {
      return res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
  }
  async function update(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (user.userType !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const { id } = req.params;
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
  
      const validationResult = validateProduct(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: 'Invalid product data',
          errors: validationResult.error.errors,
        });
      }
  
      const _id = new ObjectId(id);
      const productToUpdate = await em.findOne(Product, { _id });
      if (!productToUpdate) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      em.assign(productToUpdate, req.body);
      await em.flush();
  
      return res.status(200).json({ message: 'Product updated', data: productToUpdate });
    } catch (error: any) {
      return res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
  }    
  async function remove(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (user.userType !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      const { id } = req.params;
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
  
      const _id = new ObjectId(id);
      const product = await em.findOne(Product, { _id });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      await em.removeAndFlush(product);
      return res.status(200).json({ message: 'Product removed', data: product });
    } catch (error: any) {
      return res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
  }
export { findAll, findOne, add, update, remove}