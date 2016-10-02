var express = require('express'); // Ingreso el framework descargado
var mongoose = require('mongoose');
var bodyparser = require('body-parser'); // para poder leer el body de un post
var multer = require('multer');
var cloudinary = require('cloudinary');
var method_override = require("method-override");
var app_password = "123";
var app = express();


cloudinary.config({
	cloud_name: "arratia391",
	api_key: "521789733332255",
	api_secret: "0m4MpgyOK4t7rxk9YsKYKSsku4g"
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public")); 
app.use(multer([{dest: "./uploads"}]));
app.use(method_override("_method"));

app.set("view engine","jade"); /* para poder utilizar jade */



mongoose.connect('mongodb://localhost/spinal_db', function(error){
   if(error){
      throw error; 
   }else{
      console.log('Conectado a MongoDB');
   }
});

var productSchema = {
	nombreCompleto: String,
	usuario: String,
	fechaNacimiento: Date,
	ocupacion: String,
	email: String,
	contraseña: String

};

var Expert = mongoose.model("Expert", productSchema);

app.set ("view engine", "jade")

app.get("/",function(solicitud,respuesta){
	respuesta.render("admin");  
});

app.get("/loginExp", function(solicitud, respuesta){
	respuesta.render("admin");
});

//**************  PESTAÑA ACERCA DE  ***********************
app.get("/acercaDe", function(solicitud, respuesta){
	respuesta.render("acercaDe");
});

//**************  PESTAÑA GUÍA DE USUARIO  ***********************
app.get("/informacion", function(solicitud, respuesta){
	respuesta.render("guiaDeUsuario");
});

//*************  PESTAÑA LOGIN EXPERTOS  ********************
app.post("/admin", function(solicitud, respuesta){
	console.log(solicitud.body);
	if(solicitud.body.userExp == 'rodrigo' && solicitud.body.passwordExp == app_password){
		respuesta.render("engine/ingresoDatosMatriz");
	}
	else{
		respuesta.redirect("/");
	}

});

//*************  PESTAÑA LOGIN ADMINISTRADOR  ********************
app.get("/loginAdmin", function(solicitud, respuesta){
	respuesta.render("gestionAdministrador");  
});

app.post("/gestionAdministrador", function(solicitud, respuesta){
	if(solicitud.body.userAdmin == 'rodrigo' && solicitud.body.passwordAdmin == '123'){
		respuesta.render("opcionesAdmin");
	}
	else{
		respuesta.redirect("gestionAdministrador");
	}
});

app.get("/agregar", function(solicitud, respuesta){
	respuesta.render("agregar");  
});

app.post("/agregarPost", function(solicitud, respuesta){
	console.log(solicitud.body);
	var data = {
		nombreCompleto: solicitud.body.nombreCompleto,
		usuario: solicitud.body.nuevoUsuario,
		fechaNacimiento: solicitud.body.fechaDeNacimiento,
		ocupacion: solicitud.body.ocupacion,
		email: solicitud.body.correoElectronico,
		contraseña: solicitud.body.nuevaContraseña
	}
	var expert = new Expert(data);
	
	expert.save(function(err){
		console.log(expert);
	});
	
	respuesta.render("admin");
});

app.get("/editarEliminar", function(solicitud,respuesta){
	Expert.find(function(error,documento){
		if(error){console.log(error);}
		respuesta.render("editarEliminar", {expertos: documento});
	});
});

app.get("/menu/edit/:id", function(solicitud, respuesta){
	var id_experto = solicitud.params.id;
	Expert.findOne({"_id": id_experto}, function(error, experto){ 
	console.log(experto);
	respuesta.render("editar", {datos: experto});
	});
});

app.put("/menu/:id", function(solicitud, respuesta){
	var data = {
		nombreCompleto: solicitud.body.nombreCompleto,
		usuario: solicitud.body.nuevoUsuario,
		fechaNacimiento: solicitud.body.fechaDeNacimiento,
		ocupacion: solicitud.body.ocupacion,
		email: solicitud.body.correoElectronico,
		contraseña: solicitud.body.nuevaContraseña
	}
	Expert.update({"_id": solicitud.params.id},data, function(experto){
		respuesta.redirect("/editarEliminar");
	});
});

app.post("/ingresoDimencionesMatriz", function(solicitud, respuesta){
	var criterios = solicitud.body.criterios;
	var alternativas = solicitud.body.alternativas;
	respuesta.render("engine/ingresoDatosMatriz", {datos: solicitud});
});


app.listen(8080);
	