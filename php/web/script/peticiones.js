 $(function(){

	$("#atrasS").hide();
	$("#atrasP").hide();
	$("#atrasSP").hide();
	$("#partidas").hide();
	$("#subpartidas").hide();
	$("#fracciones").hide();
	$("#busqueda").hide();


	var opcionesVista = {"b1":"secciones","b2":"partidas","b3":"subpartidas","b4":"fracciones","b5":"secciones"};
	function soloUna(opcion){
		$("#busqueda").hide();
		$("#secciones").hide();
		$("#partidas").hide();
		$("#subpartidas").hide();
		$("#fracciones").hide();
		$("#"+opcion).show();
	}

	function busqueda(palabra,contenedor){
		$.ajax({
			url: './script/BUSCAME2.php',
			type: 'POST',
			dataType: 'json',
			data: {opc:'busqueda', busqueda:palabra},
			success: function(data){


					$("#accordionRB").remove();

					var div0 = document.createElement("div");
					$(div0).addClass("accordion");
					$(div0).attr("id","accordionRB");
					$("#busqueda").append(div0);

					var divTit = document.createElement("div");
					$(divTit).addClass("divTit");
					$(divTit).css("margin-top","50px");
					var h3 = document.createElement("h3");
					$(h3).html("Resutados de la búsqueda");
					$(divTit).append(h3);
					$("#accordionRB").append(divTit);

					for(var i= 1; i<11; i++){
						if(data.hasOwnProperty(i)){

							var div1 = document.createElement("div");
							$(div1).addClass("accordion-group");
							var div2 = document.createElement("div");
							$(div2).addClass("accordion-heading");
							$(div2).addClass("inactivo");
							var a = document.createElement("a");
							$(a).addClass("accordion-toggle");
							$(a).attr("data-toggle","collapse");
							$(a).attr("data-parent","#accordionRB");
							$(a).attr("href","#");
							$(a).attr("id",data[i].fraccion);
							$(a).addClass("opcbusq");
							
							$(a).append("<b>Fracción "+data[i].fraccion+".</b> "+data[i].descripcion);
							var icono = document.createElement("i");
							$(icono).addClass("icon-chevron-right");
							$(icono).css("float","right");
							$(a).append(icono);
							$(div2).append(a);
							$(div1).append(div2);
							var div3 = document.createElement("div");
							
							$(div3).addClass("accordion-body");
							$(div3).addClass("collapse");
							$(div3).css("height","0px");

							$(div1).append(div3);
							$("#accordionRB").append(div1);


						}
					}

					soloUna("busqueda");

					$(".opcbusq").click(function(){
						getIdFrac($(this),"busqueda",1);
					});

					$("#atrasB").click(function(){
						soloUna(opcionesVista[contenedor]);
						$("#accordionRB").remove();
						$(".busquedainpt").val("");
						$("#divaux").remove();
					});

			}
		});
	}

	$(".btnbusq").click(function(){
				if($($(this).parent()).find(".busquedainpt").val().length>2){
					busqueda($($(this).parent()).find(".busquedainpt").val(),$($(this).parent()).find(".busquedainpt").attr("id"));
				}
			}
	);

	

	function verMas(mostrar,opt){
		var pos = $(document).scrollTop();
		switch(opt){
			case "si":
			$("#tabla"+mostrar).show(function(){
				$(document).scrollTop(pos);
			});
			break;
			case "no":
			$("#tabla"+mostrar).hide(function(){
				$(document).scrollTop(pos);
			});
			break;
		}
	}

	function cambiarId(elemento){
		if($(elemento).attr("name")=="si")
			$(elemento).attr("name","no");
		else
			$(elemento).attr("name","si");
	}

	function regresa(actual,anterior,elanterior){
		$("#"+actual).hide();
		$("#"+anterior).show("slow",function(){
			location.href = '#'+elanterior;
		});
	}

	function cambia(valor){
		if(valor == "" || valor == " " || valor == "NULL"){
			var a = "--";
			return a;
		}
		else
			return valor;
	}

	var getIdFrac = function(elemento,contenedor,sen){

		if(sen==1){
			soloUna("busqueda");
		}

		$("#tabla1").remove();
		$("#tabla2").remove();
		$("#tabla3").remove();
		$("#divaux").remove();
		$("#r1").remove();
		var div = document.createElement("div");
		$(div).attr("id","divaux");
		$("#accordionF .accordion-heading").removeClass("activo");
		$("#accordionF .accordion-heading").addClass("inactivo");
		$("#accordionRB .accordion-heading").removeClass("activo");
		$("#accordionRB .accordion-heading").addClass("inactivo");
		$(elemento).parent().removeClass("inactivo");
		$(elemento).parent().addClass("activo");
		//$(div).addClass("row");
		
		$.ajax({
			url: './script/BUSCAME2.php',
			type: 'POST',
			dataType: 'json',
			data: {opc:'tarifa', fraccion:$(elemento).attr("id")},
			success: function(data){

                var tabla1 = "<table class='table table-striped' id='tabla1'><tbody><tr><th>Sección "+data[0].seccion+"</th><td>"+data[0].seccion_desc+"</td></tr><tr><th>Capitulo "+data[0].capitulo+"</th><td>"+data[0].capitulo_desc+"</td></tr><tr><th>Partida "+data[0].partida+"</th><td>"+data[0].partida_desc+"</td></tr><tr><th>Subpartida "+data[0].subpartida+"</th><td>"+data[0].subpartida_desc+"</td></tr><tr><th>Fracción "+data[0].fraccion+"</th><td>"+data[0].fraccion_desc+"</td></tr><tr><th>Unidad de Medida</th><td>"+data[0].unidad_medida+"</td></tr></tbody></table>";
				$(div).append(tabla1);

				var tabla2 = "<table class='table table-striped' id='tabla2'><thead><tr><th>Importación</th><th>Arancel</th><th>IVA</th></tr></thead><tbody><tr><th>Resto del territorio</th><td>"+cambia(data[0].arancel_importacion_rt)+"</td><td>"+cambia(data[0].iva_importacion_rt)+"</td></tr><tr><th>Franja fronteriza</th><td>"+cambia(data[0].arancel_importacionn_ff)+"</td><td>"+cambia(data[0].iva_importacion_ff)+"</td></tr><tr><th>Región fronteriza</th><td>"+cambia(data[0].arancel_importacion_rf)+"</td><td>"+cambia(data[0].iva_importacion_rf)+"</td></tr></tbody></table>";
				$(div).append(tabla2);

				var tabla3 = "<table class='table table-striped' id='tabla3'><thead><tr><th>Exportación</th><th>Arancel</th><th>IVA</th></tr></thead><tbody><tr><th>Resto del territorio</th><td>"+cambia(data[0].arancel_exportacion_rt)+"</td><td>"+cambia(data[0].iva_exportacion_rt)+"</td></tr><tr><th>Franja fronteriza</th><td>"+cambia(data[0].arancel_exportacion_ff)+"</td><td>"+cambia(data[0].iva_exportacion_ff)+"</td></tr><tr><th>Región fronteriza</th><td>"+cambia(data[0].arancel_exportacion_rf)+"</td><td>"+cambia(data[0].iva_exportacion_rf)+"</td></tr></tbody></table>";
				$(div).append(tabla3);

				
				var tabla4 = "<h4>Tratados de Libre Comercio</h4><table id='tabla4' ><tbody><tr><td rowspan='2' style='width:50px; text-align:center;'><img src='./img/bolivia.png' class='imgb'></td><td>Bolivia</td><td rowspan='2' style='width:50px; text-align:center;'><img src='./img/canada.png' class='imgb'></td><td>Cánada</td></tr><tr><td style='width:80px'>"+cambia(data[0].tlc_bolivia)+"</td><td style='width:80px'>"+cambia(data[0].tlc_canada)+"</td></tr><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/chile.png' class='imgb'></td><td>Chile</td><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/colombia.png' class='imgb'></td><td>Colombia</td></tr><tr><td>"+cambia(data[0].tlc_chile)+"</td><td>"+cambia(data[0].tlc_colombia)+"</td></tr><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/comeur.png' class='imgb'></td><td>Comunidad Europea</td><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/costarica.png' class='imgb'></td><td>Costa Rica</td></tr><tr><td>"+cambia(data[0].tlc_comunidad_europea)+"</td><td>"+cambia(data[0].tlc_costa_rica)+"</td></tr><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/elsalvador.png' class='imgb'></td><td>El Salvador</td><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/guatemala.png' class='imgb'></td><td>Guatemala</td></tr><tr><td>"+cambia(data[0].tlc_el_salvador)+"</td><td>"+cambia(data[0].tlc_guatemala)+"</td></tr><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/honduras.png' class='imgb'></td><td>Honduras</td><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/islandia.png' class='imgb'></td><td>Islandia</td></tr><tr><td>"+cambia(data[0].tlc_honduras)+"</td><td>"+cambia(data[0].tlc_islandia)+"</td></tr><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/israel.png' class='imgb'></td><td>Israel</td><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/japon.png' class='imgb'></td><td>Japón</td></tr><tr><td>"+cambia(data[0].tlc_israel)+"</td><td>"+cambia(data[0].tlc_japon)+"</td></tr><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/liechtenstein.png' class='imgb'></td><td>Liechtenstein</td><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/nicaragua.png' class='imgb'></td><td>Nicaragua</td></tr><tr><td>"+cambia(data[0].tlc_liechtenstein)+"</td><td>"+cambia(data[0].tlc_nicaragua)+"</td></tr><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/noruega.png' class='imgb'></td><td>Noruega</td><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/suiza.png' class='imgb'></td><td>Suiza</td></tr><tr><td>"+cambia(data[0].tlc_noruega)+"</td><td>"+cambia(data[0].tlc_suiza)+"</td></tr><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/uruguay.png' class='imgb'></td><td>Uruguay</td><td rowspan='2' style='width:auto; text-align:center;'><img src='./img/usa.png' class='imgb'></td><td>EUA</td></tr><tr><td>"+cambia(data[0].tlc_uruguay)+"</td><td>"+cambia(data[0].tlc_eua)+"</td></tr></tbody></table>";
				$(div).append(tabla4);

				var tabla5 = "<h5>Cupos</h5><table class='table table-striped' id='tabla5'><tbody><tr><td>Importación</td><td>"+cambia(data[0].cupos_importar_de)+"</td></tr><tr><td>Exportación</td><td>"+cambia(data[0].cupos_exportar_a)+"</td></tr></tbody></table>";
				$(div).append(tabla5);
				
				var tabla6 = "<h5><a class='ver' id='6' name='si'>Restricciones  <i class='icon-plus'></i></a></h5><table class='table table-striped' id='tabla6'><tbody><tr><td>Importación</td></tr><tr><td>"+cambia(data[0].restricciones_importacion)+"</td></tr><tr><td>Exportación</td></tr><tr><td>"+cambia(data[0].restricciones_exportacion)+"</td></tr></tbody></table>";
				$(div).append(tabla6);
				
				var tabla7 = "<h5><a class='ver' id='7' name='si'>Observaciones  <i class='icon-plus'></i></a></h5><table class='table table-striped' id='tabla7'><tbody><tr><td>Generales<td></tr><tr><td>"+cambia(data[0].observaciones_generales)+"</td></tr><tr><td>Importación</td></tr><tr><td>"+cambia(data[0].observaciones_importacion)+"</td></tr><tr><td>Exportación</td></tr><tr><td>"+cambia(data[0].observaciones_exportacion)+"</td></tr></tbody></table>";
				$(div).append(tabla7);

				var tabla8 = "<h5><a class='ver' id='8' name='si'>Anexos  <i class='icon-plus'></i></a></h5><table class='table table-striped' id='tabla8'><tbody><tr><td>"+cambia(data[0].anexos)+"</td></tr></tbody></table>";
				$(div).append(tabla8);

				$("#"+contenedor).append(div);
				$("#tabla7").hide();
				$("#tabla8").hide();
				$("#tabla6").hide();
				$("#6").click(function(){
					verMas($(this).attr("id"),$(this).attr("name"));
					cambiarId($(this));
				});
				$("#7").click(function(){
					verMas($(this).attr("id"),$(this).attr("name"));
					cambiarId($(this));
				});
				$("#8").click(function(){
					verMas($(this).attr("id"),$(this).attr("name"));
					cambiarId($(this));
				});
				
				
				
			} 
		});     
	}

	var getIdSubPart = function(elemento){
		$("#subpartidas").hide();
		$("#tabla1").remove();
		$("#tabla2").remove();
		$("#tabla3").remove();
		$("#divaux").remove();
		$("#atrasSP").show();
		$("#titspart").html("Subpartida "+$(elemento).attr("id"));
		$("#titspart").css("color","white");
		$("#r1").remove();
		$.ajax({
			url: './script/BUSCAME2.php',
			type: 'POST',
			dataType: 'json',
			data: {opc:'fracciones', subpartida:$(elemento).attr("id")},
			success: function(data){

				$("#accordionF").remove();

				var div0 = document.createElement("div");
				$(div0).addClass("accordion");
				$(div0).attr("id","accordionF");
				$("#fracciones").append(div0);

				var body = $(elemento).text();
					var temp = document.createElement("i");
					temp.innerHTML = body;
					var divTit = document.createElement("div");
					$(divTit).addClass("divTit");
					var p = document.createElement("p");
					$(p).addClass("pad");
					var test = temp.textContent || temp.innerText;
					test = test.split(". ");
					var h3 = document.createElement("h3");
					$(h3).html(test[0]);
					$(p).append(h3);
					$(p).append(test[1]);
					$(divTit).append(p);
					$("#accordionF").append(divTit);

				$(data).each(function(frac){
					var div1 = document.createElement("div");
					$(div1).addClass("accordion-group");
					var div2 = document.createElement("div");
					$(div2).addClass("accordion-heading");
					$(div2).addClass("inactivo");
					var a = document.createElement("a");
					$(a).addClass("accordion-toggle");
					$(a).attr("data-toggle","collapse");
					$(a).attr("data-parent","#accordionF");
					$(a).attr("href","#"+data[frac].fraccion+"s");
					$(a).attr("id",data[frac].fraccion);
					$(a).addClass("getIdFrac");
					/*var texto = "Fracción "+data[frac].fraccion+". "+data[frac].fraccion_desc;
					var txta = document.createTextNode(texto);*/
					$(a).append("<b>Fracción "+data[frac].fraccion+".</b> "+data[frac].fraccion_desc);
					var icono = document.createElement("i");
					$(icono).addClass("icon-chevron-right");
					$(icono).css("float","right");
					$(a).append(icono);
					$(div2).append(a);
					$(div1).append(div2);
					var div3 = document.createElement("div");
					$(div3).attr("id",data[frac].fraccion+"s");
					$(div3).addClass("accordion-body");
					$(div3).addClass("collapse");
					$(div3).css("height","0px");

					$(div1).append(div3);
					$("#accordionF").append(div1);

				}); 
				$("#fracciones").show("slow");
				$(".getIdFrac").click(function(){
					getIdFrac($(this),"fracciones");
				});

				$("#atrasSP").click(function(){
						regresa("fracciones","subpartidas",$(elemento).attr("id"));
					});

			}
		});
}

var getIdPart = function(elemento){
	$("#fracciones").hide();
	$("#partidas").hide();
	$("#atrasP").show();
	$("#titpart").html("Partida "+$(elemento).attr("id"));
	$("#titpart").css("color","white");
	$("#r1").remove();
			//alert($(elemento).attr("id"));
			$.ajax({
				url: './script/BUSCAME2.php',
				type: 'POST',
				dataType: 'json',
				data: {opc:'subpartidas', partida:$(elemento).attr("id")},
				success: function(data){
					
					$("#accordionSP").remove();

					var div0 = document.createElement("div");
					$(div0).addClass("accordion");
					$(div0).attr("id","accordionSP");
					$("#subpartidas").append(div0);

					var body = $(elemento).text();
					var temp = document.createElement("i");
					temp.innerHTML = body;
					var divTit = document.createElement("div");
					$(divTit).addClass("divTit");
					var p = document.createElement("p");
					$(p).addClass("pad");
					var test = temp.textContent || temp.innerText;
					test = test.split(". ");
					var h3 = document.createElement("h3");
					$(h3).html(test[0]);
					$(p).append(h3);
					$(p).append(test[1]);
					$(divTit).append(p);
					$("#accordionSP").append(divTit);

					$(data).each(function(subpart){
						var div1 = document.createElement("div");
						$(div1).addClass("accordion-group");
						var div2 = document.createElement("div");
						$(div2).addClass("accordion-heading");
						var a = document.createElement("a");
						$(a).addClass("accordion-toggle");
						$(a).attr("data-toggle","collapse");
						$(a).attr("data-parent","#accordionE");
						$(a).attr("href","#"+data[subpart].subpartida+"s");
						$(a).attr("id",data[subpart].subpartida);
						$(a).addClass("getIdSubPart");
						/*var texto = "Subpartida "+data[subpart].subpartida+". "+data[subpart].subpartida_desc;
						var txta = document.createTextNode(texto);*/
						$(a).append("<b>Subpartida "+data[subpart].subpartida+".</b> "+data[subpart].subpartida_desc);
						var icono = document.createElement("i");
						$(icono).addClass("icon-chevron-right");
						$(icono).css("float","right");
						$(a).append(icono);
						$(div2).append(a);
						$(div1).append(div2);
						var div3 = document.createElement("div");
						$(div3).attr("id",data[subpart].subpartida+"s");
						$(div3).addClass("accordion-body");
						$(div3).addClass("collapse");
						$(div3).css("height","0px");

						$(div1).append(div3);
						$("#accordionSP").append(div1);

					}); 

					$("#subpartidas").show("slow");
					$(".getIdSubPart").click(function(){
						getIdSubPart($(this));
					}); 

					$("#atrasP").click(function(){
						regresa("subpartidas","partidas",$(elemento).attr("id"));
					});

}
});
}

var getIdCap = function(elemento){
	$("#atrasS").show();
	$("#subpartidas").hide();
	$("#fracciones").hide();
	$("#secciones").hide();
	$("#titcap").html("Capitulo "+$(elemento).attr("id"));
	$("#titcap").css("color","white");
	$("#r1").remove();
	$.ajax({
		url: './script/BUSCAME2.php',
		type: 'POST',
		dataType: 'json',
		data: {opc:'partidas', capitulo:$(elemento).attr("id")},
		success: function(data){
					$("#accordionP").remove();

					var div0 = document.createElement("div");
					$(div0).addClass("accordion");
					$(div0).attr("id","accordionP");
					$("#partidas").append(div0);

					var body = $(elemento).text();
					var temp = document.createElement("i");
					temp.innerHTML = body;
					var divTit = document.createElement("div");
					$(divTit).addClass("divTit");
					var p = document.createElement("p");
					$(p).addClass("pad");
					var test = temp.textContent || temp.innerText;
					test = test.split(". ");
					var h3 = document.createElement("h3");
					$(h3).html(test[0]);
					$(p).append(h3);
					$(p).append(test[1]);
					$(divTit).append(p);
					$("#accordionP").append(divTit);

					$(data).each(function(part){
						var div1 = document.createElement("div");
						$(div1).addClass("accordion-group");
						var div2 = document.createElement("div");
						$(div2).addClass("accordion-heading");
						var a = document.createElement("a");
						$(a).addClass("accordion-toggle");
						$(a).attr("data-toggle","collapse");
						$(a).attr("data-parent","#accordionD");
						$(a).attr("href","#"+data[part].partida+"s");
						$(a).attr("id",data[part].partida);
						$(a).addClass("getIdPart");
						
						$(a).append("<b>Partida "+data[part].partida+".</b> "+data[part].partida_desc);
						var icono = document.createElement("i");
						$(icono).addClass("icon-chevron-right");
						$(icono).css("float","right");
						$(a).append(icono);
						$(div2).append(a);
						$(div1).append(div2);
						var div3 = document.createElement("div");
						$(div3).attr("id",data[part].partida+"s");
						$(div3).addClass("accordion-body");
						$(div3).addClass("collapse");
						$(div3).css("height","0px");

						$(div1).append(div3);
						$("#accordionP").append(div1);

					});
					$("#partidas").show("slow");
					$(".getIdPart").click(function(){
						getIdPart($(this));
					}); 

					$("#atrasS").click(function(){
						regresa("partidas","secciones",$(elemento).attr("id"));
					});

				}
			});
}

var getIdSec = function(elemento){
	$("#partidas").hide();
	$("#subpartidas").hide();
	$("#fracciones").hide();
	$("#r1").remove();
	//$("#i"+$(elemento).attr("id")).removeClass();
	if($("#i"+$(elemento).attr("id")).attr("class") == "icon-chevron-right")
		$("#i"+$(elemento).attr("id")).attr("class","icon-chevron-down");
	else
		$("#i"+$(elemento).attr("id")).attr("class","icon-chevron-right");
	$.ajax({
		url      : './script/BUSCAME2.php',
		type 	   : 'POST',
		dataType : 'json',
		data     : {opc:'capitulos',seccion:$(elemento).attr("id")},
		success  : function(data){

			var div1 = document.createElement("div");
			$(div1).addClass("accordion");
			$(div1).attr("id","accordionC");


			$(data).each(function(cap){
				var div2 = document.createElement("div");
				$(div2).addClass("accordion-group");
				var div3 = document.createElement("div");
				$(div3).addClass("accordion-heading");
				$(div3).css("background-color","white");
				
				var a = document.createElement("a");
				$(a).addClass("accordion-toggle");
				$(a).attr("data-toggle","collapse");
				$(a).attr("data-parent","#accordionC");
				$(a).attr("href","#"+data[cap].capitulo+"s");
				$(a).attr("id",data[cap].capitulo);
				$(a).addClass("getIdCap");
				$(a).append("<b>Capitulo "+data[cap].capitulo+".</b> "+data[cap].capitulo_desc);
				var icono = document.createElement("i");
				$(icono).addClass("icon-chevron-right");
				$(icono).css("float","right");
				$(a).append(icono);
				$(div3).append(a);
				$(div2).append(div3);
				$(div1).append(div2);
			});

			var group = $("#"+$(elemento).attr("id")).parent().parent();
			$($(group).find(".accordion-inner")).html("");
			$($(group).find(".accordion-inner")).append(div1);

			$(".getIdCap").click(function(){
				getIdCap($(this));
			});



		}
	});
}

$.ajax({
	url      : './script/BUSCAME2.php',
	type 	   : 'POST',
	dataType : 'json',
	data     : {opc:'secciones'},
	success  : function(data) {

		$(data).each(function(sec){
			var div1 = document.createElement("div");
			$(div1).addClass("accordion-group");
			//$(div1).css("background-color","#E1DFDF");
			$(div1).css("border-style","none");
			var div2 = document.createElement("div");
			$(div2).addClass("accordion-heading");
			$(div2).css("background-color","#E1DFDF");
			var a = document.createElement("a");
			$(a).addClass("accordion-toggle");
			$(a).attr('data-toggle','collapse');
			$(a).attr('data-parent','#accordionS');
			$(a).attr('href','#'+data[sec].seccion+"s");
			$(a).attr('id',data[sec].seccion);
			$(a).addClass("getIdSec");
			//$(a).addClass("bold");


			var p = document.createElement("p");
			$(p).addClass("bold");
			var texto1 = "Sección "+data[sec].seccion;
			var texto2 = data[sec].seccion_desc;
 			var txta = document.createTextNode(texto1);
 			$(p).append(txta);
 			var txta2 = document.createTextNode(texto2);

			
			var icono = document.createElement("i");
			$(icono).addClass("icon-chevron-right");
			$(icono).css("float","right");
			$(icono).attr("id","i"+data[sec].seccion);
			$(a).append(icono);
			$(a).append(p);
			$(a).append(txta2);
			$(div2).append(a);
			

			var div3 = document.createElement("div");
			$(div3).addClass("accordion-body");
			$(div3).addClass("collapse");
			$(div3).attr("id",data[sec].seccion+"s");
			$(div3).css("height","0px");
			var div4 = document.createElement("div");
			$(div4).addClass("accordion-inner");
      
              	$(div3).append(div4);
              	$(div1).append(div2);
              	$(div1).append(div3);
              	$("#accordionS").append(div1);
              });

$(".getIdSec").click(function(){
	getIdSec($(this));
});
}
}); 

});