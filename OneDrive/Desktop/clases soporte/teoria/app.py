
import streamlit as st
import datetime
import matplotlib.pyplot as plt


import pandas as pd



@st._cache_data
def cargadatos():
    data = pd.read_csv("serienueva.csv")
    data.set_index('Mes', inplace=True)
    return data

new=cargadatos()



st.title("Variable")
##st.markdown("MIni Prueba")

lista=[]
for nombre in new.columns:
    if ("named" not in nombre):
          lista.append(nombre)


input="FosfatodiamónicoUSD/t"

input=st.selectbox("Producto",lista)

if input:
    
    ##new[input].plot()
    ##plt.title(input)
    ##plt.xlabel("Mes")
    ##plt.legend()
    ##plt.figure(figsize=(10,10))
    ##plt.tight_layout()
    ##st.pyplot(plt)

    st.write(input)


    nuevo_df = new[[input]]

    tab1, tab2 = st.tabs(["Chart", "Dataframe"])
    tab1.line_chart(nuevo_df, height=250)
    tab2.dataframe(nuevo_df, height=250, use_container_width=True)

    ##st.write(nuevo_df)

    st.subheader("Estadísticas Resumidas")
    st.write(new.describe())

    # Mostrar los datos en bruto
    st.subheader("Datos en bruto")
    st.dataframe(new)



