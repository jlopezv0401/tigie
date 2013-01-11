<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Example
 *
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array.
 *
 * @package		CodeIgniter
 * @subpackage	Rest Server
 * @category	Controller
 * @author		Moy Lopez
 * @link		http://philsturgeon.co.uk/code/
*/

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';
require APPPATH.'/libraries/sphinxapi.php';
require APPPATH.'/libraries/simple_html_dom.php';

class Api extends REST_Controller {

	function tarifa_get() {

		if(!$this->get('fraccion')) {
			$this->response(NULL, 400);
		}
		else $fraccion = $this->get('fraccion');

		$resultado = $this->tarifa_model->read_fraccion_esp($fraccion);
		if($resultado) {
			$this->response($resultado, 200);
		}
		else {
			$this->response(array('error' => 'Fraccion no encontrada'), 404);
		}
	}

	function seccion_get() {
		$resultado = $this->tarifa_model->read_seccion();
		if($resultado) {
			$this->response($resultado, 200);
		}
		else {
			$this->response(array('error' => 'Seccion no encontrada'), 404);
		}
	}

	function capitulo_get() {
		if(!$this->get('seccion')) {
			$seccion = '';
		}
		else $seccion = $this->get('seccion');

		$resultado = $this->tarifa_model->read_capitulo($seccion);
		if($resultado) {
			$this->response($resultado, 200);
		}
		else {
			$this->response(array('error' => 'Capitulo no encontrado'), 404);
		}
	}

	function partida_get() {
		if(!$this->get('capitulo')) {
			$capitulo = '';
		}
		else $capitulo = $this->get('capitulo');

		$resultado = $this->tarifa_model->read_partida($capitulo);
		if($resultado) {
			$this->response($resultado, 200);
		}
		else {
			$this->response(array('error' => 'Partida no encontrado'), 404);
		}
	}

	function subpartida_get() {
		if(!$this->get('partida')) {
			$partida = '';
		}
		else $partida = $this->get('partida');

		$resultado = $this->tarifa_model->read_subpartida($partida);
		if($resultado) {
			$this->response($resultado, 200);
		}
		else {
			$this->response(array('error' => 'Subpartida no encontrado'), 404);
		}
	}

	function fraccion_get() {
		if(!$this->get('subpartida')) {
			$subpartida = '';
		}
		else $subpartida = $this->get('subpartida');

		$resultado = $this->tarifa_model->read_fraccion($subpartida);
		if($resultado) {
			$this->response($resultado, 200);
		}
		else {
			$this->response(array('error' => 'Fraccion no encontrado'), 404);
		}
	}

	function buscar_get() {
		if(!$this->get('palabras')) {
			$palabras = '';
		}
		else $palabras = $this->get('palabras');
		

		$url = 'http://www.siicex-caaarem.org.mx/Bases/TIGIE2007.nsf/d58945443a3d19d886256bab00510b2e?SearchView&Query=' . $palabras . '&SearchMax=20&SearchWV=true';
		$html = file_get_html($url);
		$tabla = $html->find('tbody');
		echo $tabla;
	}

	function buscar_palabras_get() {
		if(!$this->get('palabras')) {
			$palabras = '';
		}
		else $palabras = $this->get('palabras');

		$cl = new SphinxClient ();

		$q = $palabras;
		$sql = "";
		$mode = SPH_MATCH_ALL;
		$host = "localhost";
		$port = 9312;
		$index = "tigie";
		$groupby = "subpartida";
		$groupsort = "@group desc";
		$filter = "group_id";
		$filtervals = array();
		$distinct = "";
		$sortby = "";
		$sortexpr = "";
		$limit = 40;
		$ranker = SPH_RANK_PROXIMITY_BM25;
		$select = "";

		$cl->SetServer ( $host, $port );
		$cl->SetConnectTimeout ( 1 );
		$cl->SetArrayResult ( true );
		$cl->SetWeights ( array ( 100, 1  ) );
		$cl->SetMatchMode ( $mode );
		if ( count($filtervals) )	$cl->SetFilter ( $filter, $filtervals );
		if ( $groupby )				$cl->SetGroupBy ( $groupby, SPH_GROUPBY_ATTR, $groupsort );
		if ( $sortby )				$cl->SetSortMode ( SPH_SORT_EXTENDED, $sortby );
		if ( $sortexpr )			$cl->SetSortMode ( SPH_SORT_EXPR, $sortexpr );
		if ( $distinct )			$cl->SetGroupDistinct ( $distinct );
		if ( $select )				$cl->SetSelect ( $select );
		if ( $limit )				$cl->SetLimits ( 0, $limit, ( $limit>1000 ) ? $limit : 1000 );
		$cl->SetRankingMode ( $ranker );
		$res = $cl->Query ( $q, $index );
		if ( $res===false ){
		    print "Falló la busqueda: " . $cl->GetLastError() . ".\n";

		} else{
			$busqueda = array();
			if (isset($res['matches'])){
				foreach ($res['matches'] as $info) {
					$consulta = $this->tarifa_model->read_fraccion_esp($info['id']);
					//var_dump($consulta[0]['fraccion']);
					//var_dump($info['id']);
					$busqueda[$consulta[0]['fraccion']] = array (
						'fraccion_desc' => $consulta[0]['fraccion_desc'],
						'partida_desc' => $consulta[0]['partida_desc'],
						'subpartida_desc' => $consulta[0]['subpartida_desc'],
						);
				}

				if($busqueda) {
						$this->response($busqueda, 200);
					}
					else {
						$this->response(array('error' => 'No se obtuvieron resultados de la busqueda'), 404);
					}
			}
			else {
				$this->response(array('error' => 'No se obtuvieron resultados de la busqueda'), 404);
			}
		}
	}

}