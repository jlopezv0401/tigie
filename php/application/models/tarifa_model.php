<?php
class Tarifa_model extends CI_Model {

    public function __construct(){
        $this->load->database();
    }

    public function create_fraccion(){
        $this->load->helper('url');
        $data= array(
            'nombre' =>  $this->input->post('nombre'),
            'descripcion' => $this->input->post('descripcion'),
            'id_programa' => $this->input->post('id_programa')
        );
        return $this->db->insert('Area', $data);
    }

    // public function read_fraccion(){
    //     $fraccion=$this->input->post('fraccion');
    //     $fracciones = $this->db->get_where('tarifa', array('fraccion' => $fraccion));
    //     return $fracciones->result_array();
    // }

    public function update_fraccion(){
        $data= array(
            'nombre' =>  $this->input->post('nombre'),
            'descripcion' => $this->input->post('descripcion'),
            'id_programa' => $this->input->post('id_programa')
        );
        $this->db->where('fraccion', $this->input->post('fraccion'));
        return $this->db->update('tarifa', $data);
    }

    public function del_fraccion(){
        $this->db->where('fraccion', $this->input->post('fraccion'));
        $this->db->delete('tarifa');
    }

    public function read_fraccion_esp($fraccion){
        //$fraccion=$this->input->post('fraccion');
        $fracciones = $this->db->get_where('tarifa', array('fraccion' => $fraccion), 1, 0);
        return $fracciones->result_array();
    }

    public function read_seccion(){
        //$fraccion=$this->input->post('fraccion');
        $secciones = $this->db->query('SELECT DISTINCT(seccion), seccion_desc FROM tarifa');
        return $secciones->result_array();
    }

    public function read_capitulo($seccion){
        //$fraccion=$this->input->post('fraccion');
        if ($seccion){
            $capitulos = $this->db->query('SELECT DISTINCT(capitulo), capitulo_desc FROM tarifa WHERE seccion=\'' . $seccion . '\'');
            return $capitulos->result_array();
        }
        else {
            $capitulos = $this->db->query('SELECT DISTINCT(capitulo), capitulo_desc FROM tarifa');
            return $capitulos->result_array();
        }
    }

    // public function read_partida($capitulo){
    //     //$fraccion=$this->input->post('fraccion');
    //     if ($capitulo){
    //         $partidas = $this->db->query('SELECT DISTINCT(partida), partida_desc FROM tarifa WHERE capitulo=\'' . $capitulo . '\' UNION (SELECT DISTINCT(partida),partida_a_desc FROM tarifa WHERE capitulo =\'' . $capitulo . '\' AND partida_a <> 0)');
    //         return $partidas->result_array();
    //     }
    //     else {
    //         $partidas = $this->db->query('SELECT DISTINCT(partida), partida_desc FROM tarifa UNION SELECT DISTINCT(partida), partida_a_desc FROM tarifa WHERE partida_a <> 0');
    //         return $partidas->result_array();
    //     }
    // }

    public function read_partida($capitulo){
        if ($capitulo){
            $partidas = $this->db->query('
                SELECT DISTINCT (partida_desc), partida FROM (SELECT DISTINCT(partida), partida_desc, partida_a_desc FROM tarifa WHERE capitulo=\'' . $capitulo . '\' ORDER BY partida) as nueva');
            return $partidas->result_array();
        }
        else {
            $partidas = $this->db->query('
               SELECT DISTINCT (partida_desc), partida FROM (SELECT DISTINCT(partida), partida_desc, partida_a_desc FROM tarifa ORDER BY partida) as nueva');
            return $partidas->result_array();
        }
    }

    public function read_subpartida($partida){
        if ($partida){
            $subpartidas = $this->db->query('SELECT DISTINCT(subpartida), subpartida_desc FROM tarifa WHERE partida=\'' . $partida . '\'');
            return $subpartidas->result_array();
        }
        else {
            $subpartidas = $this->db->query('SELECT DISTINCT(subpartida), subpartida_desc FROM tarifa');
            return $subpartidas->result_array();
        }
    }

    public function read_fraccion($subpartida){
        if ($subpartida){
            $fracciones = $this->db->query('SELECT DISTINCT(fraccion), fraccion_desc FROM tarifa WHERE subpartida=\'' . $subpartida . '\'');
            return $fracciones->result_array();
        }
        else {
            $fracciones = $this->db->query('SELECT DISTINCT(fraccion), fraccion_desc FROM tarifa');
            return $fracciones->result_array();
        }
    }

}
