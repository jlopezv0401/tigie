<?php
	$opc = $_POST['opc'];
	$base = "http://tigie-tracke.rhcloud.com/api";
	
	switch ($opc) {
		case 'secciones':
			$url = curl_init($base."/seccion/format/json");
			$resp = curl_exec($url);
			break;

		case 'capitulos':
			$url = curl_init($base."/capitulo/seccion/".$_POST['seccion']."/format/json");
			$resp = curl_exec($url);
			break;

		case 'partidas':
			$url = curl_init($base."/partida/capitulo/".$_POST['capitulo']."/format/json");
			$resp = curl_exec($url);
			break;

		case 'subpartidas':
			$url = curl_init($base."/subpartida/partida/".$_POST['partida']."./format/json");
			$resp = curl_exec($url);
			break;

		case 'fracciones':
			$url = curl_init($base."/fraccion/subpartida/".$_POST['subpartida']."/format/json");
			$resp = curl_exec($url);
			break;

		case 'tarifa':
			$url = curl_init($base."/tarifa/fraccion/".$_POST['fraccion']."/format/json");
			$resp = curl_exec($url);
			break;

		case 'busqueda':
			$url = curl_init($base."/buscar/palabras/".$_POST['busqueda']."/maximo/10");
			$resp = curl_exec($url);
			break;
		
		default:
			# code...
			break;
	}
	
?>