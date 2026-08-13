/* ==========================================================================
   LISTA DE VEHÍCULOS

   Para agregar un vehículo, copia un bloque completo { ... } y pégalo,
   separando cada bloque con una coma.

   CAMPOS:
     id          Identificador único, sin espacios ni acentos. Ej: "camaro-2015"
     anio        Año del vehículo (número)
     marca       Ej: "Chevrolet"
     modelo      Ej: "Camaro"
     carroceria  "Coupe" | "Sedán" | "SUV" | "Pickup" | "Hatchback" |
                 "Convertible" | "Van" | "Wagon"
     millas      Kilometraje en millas (número, sin comas). Ej: 71815
     precio      Precio en dólares (número, sin comas ni $). Ej: 8000
     transmision "Automática" | "Manual"
     combustible "Gasolina" | "Diésel" | "Híbrido" | "Eléctrico"
     color       Color exterior
     traccion    "FWD" | "RWD" | "AWD" | "4x4"      (opcional)
     motor       Ej: "3.6L V6"                       (opcional)
     puertas     Número de puertas                   (opcional)
     estado      "disponible" | "reservado" | "vendido"
     destacado   true = aparece primero en el catálogo
     descripcion Texto libre que se muestra en la ficha
     fotos       Nombres base de las fotos, SIN sufijo de tamaño y SIN .webp
                 Si la foto procesada es "camaro-2015-01-1200.webp",
                 aquí escribes solo "camaro-2015-01".
                 La primera de la lista es la foto de portada.
   ========================================================================== */

const VEHICULOS = [
  {
    id: "civic-2022",
    anio: 2022,
    marca: "Honda",
    modelo: "Civic Sport",
    carroceria: "Sedán",
    millas: 140798,
    precio: 15000,
    transmision: "Automática",
    combustible: "Gasolina",
    color: "Azul metalizado",
    traccion: "FWD",
    motor: "2.0L 4 cilindros",
    puertas: 4,
    estado: "disponible",
    destacado: true,
    descripcion:
      "Honda Civic Sport 2022 en azul metalizado, con rines deportivos oscuros de fábrica. Transmisión automática y motor 2.0L. Equipado con pantalla táctil, cámara de reversa y asientos deportivos. 140,798 millas reales, verificables en el odómetro (foto incluida). Interior en muy buen estado y maletero amplio. Listo para entrega inmediata.",
    fotos: [
      "civic-2022-01",
      "civic-2022-02",
      "civic-2022-03",
      "civic-2022-04",
      "civic-2022-05",
      "civic-2022-06",
      "civic-2022-07",
      "civic-2022-08",
      "civic-2022-09",
      "civic-2022-10",
      "civic-2022-11",
      "civic-2022-12",
      "civic-2022-13",
      "civic-2022-14",
      "civic-2022-15",
      "civic-2022-16",
      "civic-2022-17",
      "civic-2022-18",
    ],
  },

  {
    id: "camaro-2015",
    anio: 2015,
    marca: "Chevrolet",
    modelo: "Camaro",
    carroceria: "Coupe",
    millas: 71815,
    precio: 8000,
    transmision: "Manual",
    combustible: "Gasolina",
    color: "Rojo y negro (degradado)",
    traccion: "RWD",
    motor: "3.6L V6",
    puertas: 2,
    estado: "disponible",
    destacado: true,
    descripcion:
      "Chevrolet Camaro 2015 coupé con transmisión manual de 6 velocidades y motor 3.6L V6. Llamativo acabado en degradado de rojo a negro que lo hace único en la calle. 71,815 millas reales. Interior en tela en buen estado, aire acondicionado y pantalla con Bluetooth. Rines originales de aluminio y frenos con calipers rojos. Listo para entrega inmediata.",
    fotos: [
      "camaro-2015-01",
      "camaro-2015-02",
      "camaro-2015-03",
      "camaro-2015-04",
      "camaro-2015-05",
      "camaro-2015-06",
      "camaro-2015-07",
      "camaro-2015-08",
      "camaro-2015-09",
      "camaro-2015-10",
      "camaro-2015-11",
      "camaro-2015-12",
      "camaro-2015-13",
      "camaro-2015-14",
    ],
  },
];
