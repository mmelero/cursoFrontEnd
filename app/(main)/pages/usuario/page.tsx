/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '@/types';
import { Projeto } from '@/types';
import { UsuarioService } from '@/service/UsuarioService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let usuarioVazio: Projeto.Usuario = {
        id: null,
        nome: '',
        login: '',
        senha: '',
        email: ''
    };


    const [usuarios, setUsuarios] = useState(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = new UsuarioService;
    
    useEffect(() => {
        usuarioService.getUsuarios().then((data) => setUsuarios(data as any));

        usuarioService.listarTodos()
            .then((response) => {
                setUsuarios(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }, [usuarios]);

    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuariosDialog(false);
    };

    const saveUsuario = () => {
        let _usuarios = (usuarios as any)?.filter((val: any) => val.id !== usuario.id);

        setSubmitted(true);
        if(!usuario.id){
            usuarioService.inserir(usuario)
                .then((response) => {
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios(_usuarios);

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Usuario cadastrado com sucesso!',
                        life: 3000
                    });
                }).catch((error) => {
                    console.log(error.data);
                    setUsuario(usuarioVazio);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Ocorreu um erro ao cadastrar Usuario, verifique!',
                        life: 3000
                    });               
                })

        }
        else {
            usuarioService.alterar(usuario)
            .then((response) => {
                console.log(usuario);
                setUsuarioDialog(false);
                setUsuario(usuarioVazio);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Usuario Alterado com sucesso!',
                    life: 3000
                });
            }).catch((error) => {
                setUsuario(usuarioVazio);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Ocorreu um erro ao Alterar Usuario, verifique!',
                    life: 3000
                });               
            });
        }

    };

    const editUsuario = (usuario: Projeto.Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Projeto.Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        let _usuarios = (usuarios as any)?.filter((val: any) => val.id !== usuario.id);

        usuarioService.excluir(usuario.id)
            .then((response) => {
                setDeleteUsuarioDialog(false);
                setUsuario(usuarioVazio);
                setUsuarios(_usuarios);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Usuario Excluido!',
                    life: 3000
                })

             }).catch((error) => {
                setUsuario(usuarioVazio);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Ocorreu um erro ao Exluir Usuario, verifique!',
                    life: 3000
                });               
             });

    };

    const exportCSV = () => {

        dt.current?.exportCSV();

    };

    const confirmDeleteSelected = () => {

        setDeleteUsuariosDialog(true);
    };

     const deleteSelectedUsuarios = () => {
        let _usuarios = (usuarios as any)?.filter((val: any) => !(selectedUsuarios as any)?.includes(val));
         setUsuarios(_usuarios);
         setDeleteUsuariosDialog(false);
         setSelectedUsuarios(null);
         toast.current?.show({
             severity: 'success',
             summary: 'Successful',
             detail: 'Usuarios Excluidos!',
             life: 3000
         });
     };

      const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nome: string) => {
          const val = (e.target && e.target.value) || '';
          let _usuario = { ...usuario };
          _usuario[`${nome}`] = val;

          setUsuario(_usuario);
      };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const loginBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Login</span>
                {rowData.login}
            </>
        );
    };
    const emailBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">E-Mail</span>
                {rowData.email}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamentos de Usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );
    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUsuario} />
        </>
    );
    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsuarios} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={usuarios}
                        selection={selectedUsuarios}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Usuarios"
                        globalFilter={globalFilter}
                        emptyMessage="Usuarios não encontrado!."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="login" header="Login" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="E-mail" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Detalhes do Usuario" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={usuario.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.nome
                                })}
                            />
                            {submitted && !usuario.nome && <small className="p-invalid">Nome é necessario!.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="login">Login</label>
                            <InputText
                                id="login"
                                value={usuario.login}
                                onChange={(e) => onInputChange(e, 'login')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.login
                                })}
                            />
                            {submitted && !usuario.login && <small className="p-invalid">Login é necessario!.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <InputText
                                id="email"
                                value={usuario.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.email
                                })}
                            />
                            {submitted && !usuario.email && <small className="p-invalid">E-mail é necessario!.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="senha">Senha</label>
                            <InputText
                                id="senha"
                                value={usuario.senha}
                                onChange={(e) => onInputChange(e, 'senha')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.senha
                                })}
                            />
                            {submitted && !usuario.senha && <small className="p-invalid">Senha é necessario!.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    Are you sure you want to delete <b>{usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Tem certeza que deseja excluir os usuarios selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
