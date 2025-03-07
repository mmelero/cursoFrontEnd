declare namespace Projeto{

        type Usuario = {

            id?:  number;
            nome?: string;
            login?:string;
            senha?:string;
            email?:string;
            [key: string]: string | string[] | number | boolean | undefined

        };

        type Recurso = {
            
            id:? number;
            nome?: string;
            chave?: string;
            [key: string]: string | string[] | number | boolean | undefined

        }
        type Perfil = {
            
            id:? number;
            descricao?: string;
            [key: string]: string | string[] | number | boolean | undefined

        }
        type perfilUsuario = {
            
            id:? number;
            id_usuario?: Usuario;
            id_perfil?: Perfil;
            [key: string]: string | string[] | number | boolean | undefined

        }

        type PermissaoPerfilRecruso = {
            id:? number;
            perfil:? Perfil;
            recurso:? Recurso; 
        }

}