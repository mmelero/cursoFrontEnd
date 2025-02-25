import axios from "axios";
import { Projeto } from '@/types';

const axiosInstance = axios.create({
    
    baseURL: "http://localhost:8080"

});

export default axiosInstance;

export class UsuarioService{

    getUsuarios() {
       return  axiosInstance.get('/usuario', { headers: { 'Cache-Control': 'no-cache' } })
            .then((d) => d.data as Projeto.Usuario[]);
    }
    
    listarTodos(){
        return axiosInstance.get("/usuario");
    }

    inserir(usuario : Projeto.Usuario){
        return axiosInstance.post("/usuario", usuario);
    }

    alterar(usuario : Projeto.Usuario){
        return axiosInstance.put("usuario", usuario);

    }

    excluir(id: number){
        return axiosInstance.delete("/usuario/" + id);
    }

    buscarPorId(id: number){
        return axiosInstance.get("/usuario/" + id);
    }

}

