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
}