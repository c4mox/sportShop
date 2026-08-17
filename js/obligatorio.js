class Sistema {
    constructor() {
        this.ListaAdmins = [
            new Administrador("camo", "camo2024"),
            new Administrador("kevin", "kevin1234"),
            new Administrador("pedro", "pedrito124"),
            new Administrador("manu", "manu1234"),
            new Administrador("tina", "tina1234")
        ];
        this.ListaCompradores = [
            new Comprador("Camilo", "Artola", "camoartola", "Camo2025", "4213000403490902", "123"),
            new Comprador("Kevin", "Gomez", "kevingomez", "Kevin1234", "4213000403490902", "123"),
            new Comprador("Pedro", "Gonzalez", "pedrogon21", "Pedro1234", "4213000403490902", "123"),
            new Comprador("Manuel", "Gutierrez", "manu2002", "Manu1234", "4213000403490902", "123"),
            new Comprador("Martina", "Tapia", "tina2024", "Marti124", "4213000403490902", "123")
        ];
        this.ListaProductos = [
            new Producto("Pelota de Basquetbol", "Pelota de Basquetbol marca Nivia, incluye inflador de regalo.", 300, "PelotaBasquet.jpg", "activo", 5, false),
            new Producto("Botella deportiva", "Botella deportiva ideal para salir a correr o ir al gimnasio.", 120, "Botella.jpg", "activo", 5, true),
            new Producto("Pelota de Fútbol Americano", "Pelota de Fútbol Americano marca Champion Sports tamaño oficial.", 260, "PelotaFutbolAmericano.jpg", "activo", 5, true),
            new Producto("Bolso deportivo", "Bolso deportivo grande y duradero para llevar lo que quieras.", 350, "BolsoDeportivo.jpeg", "activo", 5, false),
            new Producto("Raqueta de Tenis", "Raqueta de Tenis marca Head ultimo modelo compuesta de aluminio.", 400, "raquetaTenis.jpg", "activo", 5, true),
            new Producto("Medias Antideslizantes", "Par de Medias Antideslizantes para Futbol de muy buena calidad.", 220, "MediasAntideslizantes.jpg", "activo", 5, false),
            new Producto("Licra deportiva", "Licra deportiva de manga larga ideal para epocas de frio y buen calentamiento.", 300, "Licra.jpg", "activo", 5, true),
            new Producto("Kit de Mancuernas", "Kit de mancuernas de 20kg desarmable de acero inoxidable.", 400, "kitMancuernas.jpg", "activo", 5, false),
            new Producto("Kit de Raquetas de Ping Pong", "Kit de par de Raquetas de Ping Pong con tres pelotas incluidas.", 420, "raquetaPingpong.jpg", "activo", 5, true),
            new Producto("Cuerda para saltar", "Cuerda para saltar marca Domyos con revestimiento de espuma para mayor comodidad.", 300, "CuerdaParaSaltar.jpeg", "activo", 5, false)
        ];
        this.ListaCompras = [];
        this.usuarioLogueado = null;
        this.esAdminLogueado = false;
        this.ListaProdEnOferta = [];
    }
    agregarCompradorEnSist(unComprador) { this.ListaCompradores.push(unComprador); }
    agregarCompraEnSist(unaCompra) { this.ListaCompras.push(unaCompra); }
    agregarProducto(unProducto) { this.ListaProductos.push(unProducto); }
    actualizarListaSistEnOfertaEnSist() { this.ListaProdEnOferta = this.ListaProductos.filter(producto => producto.enOferta); }
    obtenerProductosSist() { return this.ListaProductos; }
    obtenerElemento(arrayElem, prop, valor) { return arrayElem.find(elemento => elemento[prop] === valor) || null; }
    buscarUsuario(usuario) {
        const nombreUsuario = usuario.trim().toLowerCase();
        return this.ListaAdmins.find(admin => admin.usuario.toLowerCase() === nombreUsuario) || this.ListaCompradores.find(comprador => comprador.usuario.toLowerCase() === nombreUsuario) || null;
    }
    buscarCompradorPorId(id) { return this.ListaCompradores.find(comprador => comprador.id === id) || null; }
    cambiarEnOferta(idProd) {
        const producto = this.obtenerElemento(this.ListaProductos, "id", idProd);
        if (producto) producto.enOferta = !producto.enOferta;
        this.actualizarListaSistEnOfertaEnSist();
    }
    aumentarStock(idProd) {
        const producto = this.obtenerElemento(this.ListaProductos, "id", idProd);
        if (!producto) return;
        producto.stock++;
        if (producto.stock > 0) producto.estado = "activo";
    }
    disminuirStock(idProd) {
        const producto = this.obtenerElemento(this.ListaProductos, "id", idProd);
        if (!producto || producto.stock <= 0) return;
        producto.stock--;
        if (producto.stock === 0) producto.estado = "pausado";
    }
    cambiarActivoPausado(idProd, nuevoEstado) {
        const producto = this.obtenerElemento(this.ListaProductos, "id", idProd);
        if (!producto) return;
        if (nuevoEstado === "pausado") producto.estado = "pausado";
        else if (producto.stock > 0) producto.estado = "activo";
    }
    aprobarCompra(idCompra) {
        const compra = this.obtenerElemento(this.ListaCompras, "id", idCompra);
        if (!compra || compra.estado !== "pendiente") return { ok: false, mensaje: "La compra ya no está pendiente." };
        const comprador = this.buscarCompradorPorId(compra.compradorId);
        const producto = this.obtenerElemento(this.ListaProductos, "id", compra.productoId);
        if (!comprador || !producto) {
            compra.estado = "cancelada";
            return { ok: false, mensaje: "No se pudo encontrar el comprador o producto asociado." };
        }
        if (comprador.saldo < compra.total || producto.stock < compra.unidades || producto.estado !== "activo") {
            compra.estado = "cancelada";
            return { ok: false, mensaje: "La compra fue cancelada: saldo, stock o estado del producto no cumplen las condiciones." };
        }
        comprador.saldo -= compra.total;
        producto.stock -= compra.unidades;
        compra.estado = "aprobada";
        if (producto.stock === 0) producto.estado = "pausado";
        return { ok: true, mensaje: "Compra aprobada correctamente." };
    }
    cancelarCompra(idCompra) {
        const compra = this.obtenerElemento(this.ListaCompras, "id", idCompra);
        if (compra && compra.estado === "pendiente") compra.estado = "cancelada";
    }
    montoTotalCompras(compradorId) {
        return this.ListaCompras.filter(compra => compra.compradorId === compradorId && compra.estado === "aprobada").reduce((total, compra) => total + compra.total, 0);
    }
    unidadesVendidasPorProducto() {
        const ventas = {};
        this.ListaCompras.filter(compra => compra.estado === "aprobada").forEach(compra => {
            ventas[compra.productoId] = (ventas[compra.productoId] || 0) + compra.unidades;
        });
        return ventas;
    }
    gananciaTotal() {
        return this.ListaCompras.filter(compra => compra.estado === "aprobada").reduce((total, compra) => total + compra.total, 0);
    }
}

let contadorAdmin = 1;
class Administrador {
    constructor(usuario, pass) { this.id = contadorAdmin++; this.usuario = usuario; this.pass = pass; }
}

let contadorComprador = 1;
class Comprador {
    constructor(nombre, apellido, usuario, pass, nroTarjeta, codigoCVC) {
        this.id = contadorComprador++;
        this.nombre = nombre;
        this.apellido = apellido;
        this.usuario = usuario;
        this.pass = pass;
        this.nroTarjeta = nroTarjeta;
        this.codigoCVC = codigoCVC;
        this.saldo = 3000;
    }
}

let contadorProducto = 1;
class Producto {
    constructor(nombre, descripcion, precio, imagen, estado, stock, enOferta) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.stock = stock;
        this.estado = estado;
        this.enOferta = enOferta;
        this.id = "PROD_ID_" + contadorProducto++;
    }
}

let contadorCompra = 1;
class Compra {
    constructor(productoId, nombre, compradorId, unidades, total, estado) {
        this.id = contadorCompra++;
        this.productoId = productoId;
        this.nombre = nombre;
        this.compradorId = compradorId;
        this.unidades = unidades;
        this.total = total;
        this.estado = estado;
    }
}

const sistema = new Sistema();
inicio();

function inicio() {
    OcultarSecciones();
    sistema.usuarioLogueado = null;
    sistema.esAdminLogueado = false;
    document.querySelector("#seccionLogin").style.display = "block";
    document.querySelector("#btnIngresar").onclick = hacerLogin;
    document.querySelector("#btnRegistrarseYa").onclick = mostrarRegistro;
    document.querySelector("#btnRegistro").onclick = hacerRegistroComprador;
    document.querySelector("#menuCompraProductos").onclick = menuCompraProductos;
    document.querySelector("#menuListadoCompras").onclick = menuListadoCompras;
    document.querySelector("#menuProductosEnOferta").onclick = menuProductosEnOferta;
    document.querySelector("#menuAdminCrearProducto").onclick = menuCrearProducto;
    document.querySelector("#menuAdminAdministrarProd").onclick = menuAdministrarProducto;
    document.querySelector("#menuAdminListadoCompras").onclick = menuAdminAprobarCompra;
    document.querySelector("#btnCrearProd").onclick = crearProducto;
    document.querySelector("#menuCerrarSesión").onclick = cerrarSesion;
    document.querySelector("#menuCerrarSesiónAdmin").onclick = cerrarSesion;
    document.querySelector("#menuAdminVerInforme").onclick = menuVerInforme;
    document.querySelector("#slcFiltrar").onchange = ListarCompras;
    document.querySelector("#slcFiltrarAdmin").onchange = ListarComprasAdmin;
    mostrarMensaje("");
}

function OcultarSecciones() {
    document.querySelectorAll(".seccion").forEach(seccion => seccion.style.display = "none");
}

function mostrarMensaje(mensaje, error = false) {
    const elemento = document.querySelector("#pMensaje");
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = error ? "mensaje error" : "mensaje";
    }
}

function mostrarRegistro() {
    OcultarSecciones();
    document.querySelector("#seccionRegistro").style.display = "block";
    mostrarMensaje("");
}

function hacerLogin() {
    const formLogin = document.querySelector("#FormLogin");
    if (!formLogin.reportValidity()) return;
    const usuario = document.querySelector("#txtNomUsuarioAdmin").value.trim().toLowerCase();
    const pass = document.querySelector("#txtContraseñaAdmin").value;
    const usuarioEncontrado = sistema.buscarUsuario(usuario);
    if (!usuarioEncontrado) return mostrarMensaje("El usuario no existe.", true);
    if (usuarioEncontrado.pass !== pass) return mostrarMensaje("La contraseña es incorrecta.", true);
    sistema.usuarioLogueado = usuarioEncontrado instanceof Comprador ? usuarioEncontrado : null;
    sistema.esAdminLogueado = usuarioEncontrado instanceof Administrador;
    formLogin.reset();
    mostrarMensaje("");
    if (sistema.esAdminLogueado) menuAdminAprobarCompra();
    else menuCompraProductos();
}

function hacerRegistroComprador() {
    const form = document.querySelector("#FormRegistro");
    if (!form.reportValidity()) return;
    const nombre = document.querySelector("#txtNombreComp").value.trim();
    const apellido = document.querySelector("#txtApellidoComp").value.trim();
    const usuario = document.querySelector("#txtNomUsuarioComp").value.trim().toLowerCase();
    const pass = document.querySelector("#txtContraseñaComp").value;
    const nroTarjeta = eliminarGuionesTarjeta(document.querySelector("#txtNroTarjeta").value);
    const codigoCVC = document.querySelector("#txtCodigoSeg").value;
    if (sistema.buscarUsuario(usuario)) return mostrarMensaje("El nombre de usuario ya está en uso.", true);
    if (!validarTarjeta(nroTarjeta)) return mostrarMensaje("El número de tarjeta no es válido.", true);
    sistema.agregarCompradorEnSist(new Comprador(nombre, apellido, usuario, pass, nroTarjeta, codigoCVC));
    form.reset();
    OcultarSecciones();
    document.querySelector("#seccionLogin").style.display = "block";
    mostrarMensaje("Registro realizado correctamente. Ya puedes iniciar sesión.");
}

function eliminarGuionesTarjeta(tarjeta) { return tarjeta.replace(/-/g, ""); }

function validarTarjeta(numeroTarjeta) {
    if (!/^\d{16}$/.test(numeroTarjeta)) return false;
    let suma = 0;
    let duplicar = false;
    for (let i = numeroTarjeta.length - 1; i >= 0; i--) {
        let digito = Number(numeroTarjeta[i]);
        if (duplicar) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }
        suma += digito;
        duplicar = !duplicar;
    }
    return suma % 10 === 0;
}

function cerrarSesion() { inicio(); }

function menuCompraProductos() {
    OcultarSecciones();
    document.querySelector("#navPrincipalComp").style.display = "block";
    document.querySelector("#seccionCompraProductos").style.display = "block";
    actualizarListaSistEnOferta();
    armarTablaProductos();
    mostrarSaldo();
}

function menuListadoCompras() {
    OcultarSecciones();
    document.querySelector("#navPrincipalComp").style.display = "block";
    document.querySelector("#seccionListadoCompras").style.display = "block";
    ListarCompras();
}

function menuProductosEnOferta() {
    OcultarSecciones();
    document.querySelector("#navPrincipalComp").style.display = "block";
    document.querySelector("#seccionProductosEnOferta").style.display = "block";
    actualizarListaSistEnOferta();
    armarTablaProductosEnOferta();
    mostrarSaldo();
}

function menuCrearProducto() {
    OcultarSecciones();
    document.querySelector("#navPrincipalAdmin").style.display = "block";
    document.querySelector("#seccionCrearProducto").style.display = "block";
}

function menuAdministrarProducto() {
    OcultarSecciones();
    document.querySelector("#navPrincipalAdmin").style.display = "block";
    document.querySelector("#seccionAdministrarProd").style.display = "block";
    cargarTablaAdministrarProd();
}

function menuAdminAprobarCompra() {
    OcultarSecciones();
    document.querySelector("#navPrincipalAdmin").style.display = "block";
    document.querySelector("#seccionListadoyAprobacionAdmin").style.display = "block";
    ListarComprasAdmin();
}

function menuVerInforme() {
    OcultarSecciones();
    document.querySelector("#navPrincipalAdmin").style.display = "block";
    document.querySelector("#seccionVerInforme").style.display = "block";
    mostrarInforme();
}

function mostrarSaldo() {
    if (!sistema.usuarioLogueado) return;
    document.querySelector("#saldo1").textContent = sistema.usuarioLogueado.saldo;
    document.querySelector("#saldo2").textContent = sistema.usuarioLogueado.saldo;
}

function crearFilaProducto(producto, incluirOferta = true) {
    const imagen = producto.imagen;
    const marcaOferta = incluirOferta && producto.enOferta ? "EN OFERTA!" : "";
    return `<tr><td>${producto.nombre}</td><td>${producto.descripcion}</td><td>${producto.precio}</td><td>${marcaOferta}</td><td><img src="${imagen}" alt="${producto.nombre}"></td><td><input type="number" min="1" max="${producto.stock}" value="1" step="1" class="CantUnidades" id="Unid${producto.id}"></td><td><input type="button" value="Comprar" class="btnComprar" id="btnComprar${producto.id}"></td></tr>`;
}

function obtenerRutaImagen(imagen) {
    if (!imagen) return "";
    return imagen.startsWith("data:") || imagen.startsWith("http") || imagen.startsWith("img/") ? imagen : `img/${imagen}`;
}

function armarTablaProductos() {
    const tabla = document.querySelector("#tblProductos");
    tabla.innerHTML = "";
    sistema.ListaProductos.filter(producto => producto.estado === "activo" && producto.stock > 0).forEach(producto => {
        const productoParaMostrar = { ...producto, imagen: obtenerRutaImagen(producto.imagen) };
        tabla.innerHTML += crearFilaProducto(productoParaMostrar);
    });
    agregarEventosCompra();
}

function armarTablaProductosEnOferta() {
    const tabla = document.querySelector("#tblProdEnOferta");
    tabla.innerHTML = "";
    sistema.actualizarListaSistEnOfertaEnSist();
    sistema.ListaProdEnOferta.filter(producto => producto.estado === "activo" && producto.stock > 0).forEach(producto => {
        const productoParaMostrar = { ...producto, imagen: obtenerRutaImagen(producto.imagen) };
        tabla.innerHTML += crearFilaProducto(productoParaMostrar, true);
    });
    agregarEventosCompra();
}

function agregarEventosCompra() {
    document.querySelectorAll(".btnComprar").forEach(btn => btn.onclick = solicitarCompra);
}

function solicitarCompra() {
    if (!(sistema.usuarioLogueado instanceof Comprador)) return;
    const idProducto = this.id.substring(10);
    const producto = sistema.obtenerElemento(sistema.ListaProductos, "id", idProducto);
    const inputCantidad = document.querySelector(`#Unid${idProducto}`);
    const cantidad = Number(inputCantidad.value);
    if (!producto || producto.estado !== "activo" || producto.stock <= 0) return mostrarMensaje("El producto no está disponible.", true);
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > producto.stock) return mostrarMensaje("La cantidad seleccionada no es válida.", true);
    const compra = new Compra(producto.id, producto.nombre, sistema.usuarioLogueado.id, cantidad, cantidad * producto.precio, "pendiente");
    sistema.agregarCompraEnSist(compra);
    mostrarMensaje("Solicitud de compra realizada correctamente.");
    ListarCompras();
    armarTablaProductos();
}

function comprasDelUsuarioActual() {
    return sistema.ListaCompras.filter(compra => compra.compradorId === sistema.usuarioLogueado.id);
}

function ListarCompras() {
    if (!(sistema.usuarioLogueado instanceof Comprador)) return;
    const tabla = document.querySelector("#tblListadoCompras");
    const filtro = document.querySelector("#slcFiltrar").value;
    tabla.innerHTML = "";
    comprasDelUsuarioActual().filter(compra => filtro === "todas" || compra.estado === filtro).forEach(compra => {
        const boton = compra.estado === "pendiente" ? `<td><input type="button" value="Cancelar" class="btnCancelar" id="btnCancelar${compra.id}"></td>` : "<td></td>";
        tabla.innerHTML += `<tr><td>${compra.nombre}</td><td>${compra.unidades}</td><td>${compra.total}</td><td>${compra.estado}</td>${boton}</tr>`;
    });
    document.querySelector("#pResultado").innerHTML = `Monto total: ${sistema.montoTotalCompras(sistema.usuarioLogueado.id)}<br><br>Saldo disponible: ${sistema.usuarioLogueado.saldo}`;
    document.querySelectorAll(".btnCancelar").forEach(btn => btn.onclick = cancelarCompra);
}

function cancelarCompra() {
    const idCompra = Number(this.id.substring(11));
    const compra = sistema.obtenerElemento(sistema.ListaCompras, "id", idCompra);
    if (!compra || compra.compradorId !== sistema.usuarioLogueado.id) return;
    sistema.cancelarCompra(idCompra);
    ListarCompras();
}

function ListarComprasAdmin() {
    const tabla = document.querySelector("#tblListadoComprasAdmin");
    const filtro = document.querySelector("#slcFiltrarAdmin").value;
    tabla.innerHTML = "";
    sistema.ListaCompras.filter(compra => compra.estado === filtro).forEach(compra => {
        const comprador = sistema.buscarCompradorPorId(compra.compradorId);
        const accion = compra.estado === "pendiente" ? `<td><input type="button" value="Aprobar" class="btnAprobar" id="btnAprobar${compra.id}"></td>` : "<td></td>";
        tabla.innerHTML += `<tr><td>${compra.nombre}</td><td>${compra.unidades}</td><td>${compra.total}</td><td>${compra.estado}</td><td>${comprador ? comprador.usuario : "-"}</td>${accion}</tr>`;
    });
    document.querySelectorAll(".btnAprobar").forEach(btn => btn.onclick = aprobarCompra);
}

function aprobarCompra() {
    const idCompra = Number(this.id.substring(10));
    const resultado = sistema.aprobarCompra(idCompra);
    mostrarMensaje(resultado.mensaje, !resultado.ok);
    ListarComprasAdmin();
    cargarTablaAdministrarProd();
    mostrarInforme();
}

function cargarTablaAdministrarProd() {
    const tabla = document.querySelector("#tblAdministrarProd");
    tabla.innerHTML = "";
    sistema.ListaProductos.forEach(producto => {
        const imagen = obtenerRutaImagen(producto.imagen);
        const oferta = producto.enOferta ? "selected" : "";
        const noOferta = !producto.enOferta ? "selected" : "";
        const activo = producto.estado === "activo" ? "selected" : "";
        const pausado = producto.estado === "pausado" ? "selected" : "";
        tabla.innerHTML += `<tr><td>${producto.nombre}</td><td>${producto.precio}</td><td><select class="slcEnOferta" data-id="${producto.id}"><option value="EnOferta" ${oferta}>EN OFERTA</option><option value="NoEnOferta" ${noOferta}>NO</option></select></td><td><img src="${imagen}" alt="${producto.nombre}"></td><td>${producto.stock}</td><td><input type="button" value="+" class="btnAumentar" data-id="${producto.id}"><input type="button" value="-" class="btnDisminuir" data-id="${producto.id}"></td><td><select class="slcActivarPausar" data-id="${producto.id}" ${producto.stock === 0 ? "" : ""}><option value="activo" ${activo}>Activo</option><option value="pausado" ${pausado}>Pausado</option></select></td></tr>`;
    });
    document.querySelectorAll(".slcEnOferta").forEach(select => select.onchange = function () {
        const producto = sistema.obtenerElemento(sistema.ListaProductos, "id", this.dataset.id);
        if (producto) producto.enOferta = this.value === "EnOferta";
        sistema.actualizarListaSistEnOfertaEnSist();
        armarTablaProductosEnOferta();
        cargarTablaAdministrarProd();
    });
    document.querySelectorAll(".btnAumentar").forEach(btn => btn.onclick = function () { sistema.aumentarStock(this.dataset.id); cargarTablaAdministrarProd(); });
    document.querySelectorAll(".btnDisminuir").forEach(btn => btn.onclick = function () { sistema.disminuirStock(this.dataset.id); cargarTablaAdministrarProd(); });
    document.querySelectorAll(".slcActivarPausar").forEach(select => select.onchange = function () { sistema.cambiarActivoPausado(this.dataset.id, this.value); cargarTablaAdministrarProd(); });
}

function crearProducto() {
    const form = document.querySelector("#formProducto");
    if (!form.reportValidity()) return;
    const nombre = document.querySelector("#txtNombreProd").value.trim();
    const precio = Number(document.querySelector("#txtPrecio").value);
    const descripcion = document.querySelector("#txtDescProd").value.trim();
    const archivo = document.querySelector("#ImagenFile").files[0];
    const stock = Number(document.querySelector("#txtStock").value);
    if (precio <= 0 || stock <= 0) return mostrarMensaje("El precio y el stock deben ser mayores a 0.", true);
    if (sistema.ListaProductos.some(producto => producto.nombre.toLowerCase() === nombre.toLowerCase())) return mostrarMensaje("Ya existe un producto con ese nombre.", true);
    const guardarProducto = imagen => {
        sistema.agregarProducto(new Producto(nombre, descripcion, precio, imagen, "activo", stock, false));
        form.reset();
        mostrarMensaje("Producto creado correctamente.");
        cargarTablaAdministrarProd();
    };
    if (archivo) {
        const lector = new FileReader();
        lector.onload = () => guardarProducto(lector.result);
        lector.readAsDataURL(archivo);
    }
}

function mostrarInforme() {
    const contenedor = document.querySelector("#pParrafo");
    const ventas = sistema.unidadesVendidasPorProducto();
    let html = "<strong>Unidades vendidas por producto:</strong><br><br>";
    sistema.ListaProductos.forEach(producto => {
        html += `${producto.nombre}: ${ventas[producto.id] || 0} unidades<br>`;
    });
    html += `<br><strong>Ganancia total: $${sistema.gananciaTotal()}</strong>`;
    contenedor.innerHTML = html;
}
