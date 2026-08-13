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
     banner      true = es el que sale en el banner grande de arriba.
                 Solo uno debe tenerlo. Conviene el que tenga la mejor
                 foto HORIZONTAL: el banner es 16:9 y recorta las verticales.
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
    id: "corolla-le-2018",
    anio: 2018,
    marca: "Toyota",
    modelo: "Corolla LE",
    carroceria: "Sedán",
    millas: 109000,
    precio: 11000,
    transmision: "Automática",
    combustible: "Gasolina",
    color: "Negro",
    traccion: "FWD",
    puertas: 4,
    estado: "disponible",
    destacado: false,
    descripcion:
      "Toyota Corolla LE 2018 en negro. Uno de los autos más económicos de mantener y de los que menos gasolina consume. Transmisión automática, pantalla con Bluetooth, cámara de reversa y maletero amplio. Opción segura para trabajo diario o primer auto.",
    fotos: [
      "corolla-le-2018-01",
      "corolla-le-2018-02",
      "corolla-le-2018-03",
      "corolla-le-2018-04",
      "corolla-le-2018-05",
      "corolla-le-2018-06",
      "corolla-le-2018-07",
      "corolla-le-2018-08",
      "corolla-le-2018-09",
      "corolla-le-2018-10",
    ],
  },

  {
    id: "camry-se-2015",
    anio: 2015,
    marca: "Toyota",
    modelo: "Camry SE",
    carroceria: "Sedán",
    millas: 148000,
    precio: 11000,
    transmision: "Automática",
    combustible: "Gasolina",
    color: "Negro",
    traccion: "FWD",
    puertas: 4,
    estado: "disponible",
    destacado: false,
    descripcion:
      "Toyota Camry SE 2015 en negro. La versión SE trae suspensión más firme y detalles deportivos frente al LE. Transmisión automática, pantalla táctil con cámara, rines de aluminio y asientos con costuras deportivas. Confiabilidad Toyota con un toque más ágil.",
    fotos: [
      "camry-se-2015-01",
      "camry-se-2015-02",
      "camry-se-2015-03",
      "camry-se-2015-04",
      "camry-se-2015-05",
      "camry-se-2015-06",
      "camry-se-2015-07",
      "camry-se-2015-08",
      "camry-se-2015-09",
      "camry-se-2015-10",
      "camry-se-2015-11",
      "camry-se-2015-12",
    ],
  },

  {
    id: "lexus-gs350-2015",
    anio: 2015,
    marca: "Lexus",
    modelo: "GS 350",
    carroceria: "Sedán",
    millas: 131000,
    precio: 15000,
    transmision: "Automática",
    combustible: "Gasolina",
    color: "Negro",
    traccion: "RWD",
    motor: "3.5L V6",
    puertas: 4,
    estado: "disponible",
    destacado: false,
    descripcion:
      "Lexus GS 350 2015 en negro con interior de cuero color vino, una combinación poco común y muy llamativa. Motor 3.5L V6 y transmisión automática. Sedán de lujo con rines oscuros, pedales deportivos y acabados premium. Si buscas algo con presencia por este precio, este es.",
    fotos: [
      "lexus-gs350-2015-01",
      "lexus-gs350-2015-02",
      "lexus-gs350-2015-03",
      "lexus-gs350-2015-04",
      "lexus-gs350-2015-05",
      "lexus-gs350-2015-06",
      "lexus-gs350-2015-07",
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

  {
    id: "camry-le-2014",
    anio: 2014,
    marca: "Toyota",
    modelo: "Camry LE",
    carroceria: "Sedán",
    millas: 160000,
    precio: 10000,
    transmision: "Automática",
    combustible: "Gasolina",
    color: "Gris oscuro",
    traccion: "FWD",
    puertas: 4,
    estado: "disponible",
    destacado: false,
    descripcion:
      "Toyota Camry LE 2014 en gris oscuro. El Camry es de los sedanes más confiables del mercado y este llega con transmisión automática y asientos en tela oscura. Pantalla con Bluetooth, aire acondicionado y buen espacio para cinco pasajeros.",
    fotos: [
      "camry-le-2014-01",
      "camry-le-2014-02",
      "camry-le-2014-03",
      "camry-le-2014-04",
      "camry-le-2014-05",
      "camry-le-2014-06",
      "camry-le-2014-07",
      "camry-le-2014-08",
      "camry-le-2014-09",
      "camry-le-2014-10",
      "camry-le-2014-11",
    ],
  },

  {
    id: "elantra-gt-2014",
    anio: 2014,
    marca: "Hyundai",
    modelo: "Elantra GT",
    carroceria: "Hatchback",
    millas: 131000,
    precio: 9000,
    transmision: "Automática",
    combustible: "Gasolina",
    color: "Rojo",
    traccion: "FWD",
    puertas: 5,
    estado: "disponible",
    destacado: false,
    descripcion:
      "Hyundai Elantra GT 2014 hatchback en rojo, con transmisión automática. La carrocería hatchback da mucho más espacio de carga que un sedán del mismo tamaño. Rines de aluminio, aire acondicionado, radio con Bluetooth y control de crucero. Interior en tela en buen estado.",
    fotos: [
      "elantra-gt-2014-01",
      "elantra-gt-2014-02",
      "elantra-gt-2014-03",
      "elantra-gt-2014-04",
      "elantra-gt-2014-05",
      "elantra-gt-2014-06",
      "elantra-gt-2014-07",
      "elantra-gt-2014-08",
      "elantra-gt-2014-09",
      "elantra-gt-2014-10",
      "elantra-gt-2014-11",
      "elantra-gt-2014-12",
      "elantra-gt-2014-13",
      "elantra-gt-2014-14",
      "elantra-gt-2014-15",
      "elantra-gt-2014-16",
      "elantra-gt-2014-17",
      "elantra-gt-2014-18",
      "elantra-gt-2014-19",
      "elantra-gt-2014-20",
    ],
  },
];
