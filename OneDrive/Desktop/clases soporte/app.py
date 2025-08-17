from flask import Flask, request, render_template, redirect, url_for
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


app = Flask(__name__)

engine = create_engine('sqlite:///usuarios.db', echo=True, future=True)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

Base.metadata.create_all(engine)

USUARIO_VALIDO = "admin"
CONTRASEÑA_VALIDA = "1234"

@app.route("/", methods=["GET", "POST"])
def login():
    mensaje = ""
    if request.method == "POST":
        usuario_form = request.form["usuario"]
        password_form = request.form["password"]
        session = SessionLocal()
        usuario = session.query(Usuario).filter_by(username=usuario_form).first()
        session.close()
        if usuario and usuario.password == password_form:
            return  f"Bienvenido, {usuario}!"
        else:
            mensaje =  "Usuario o contraseña incorrectos."
    return render_template("login.html", mensaje=mensaje)

if __name__ == "__main__":
    # Crear usuario admin si no existe
    session = SessionLocal()
    if not session.query(Usuario).filter_by(username="admin").first():
        nuevo_usuario = Usuario(username="admin", password="1234")
        session.add(nuevo_usuario)
        session.commit()
    session.close()
app.run(debug=True)
