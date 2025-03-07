/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { PerfilUsuarioService } from '@/service/PerfilUsuarioService'; 

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const PerfilUsuario = () => {
    let perfilUsuarioVazio: Projeto.usuarioPerfil = {
        id:    '',
        id_usuario: '',
        id_perfil: ''
    };

    const [recursos, setRecursos] = useState([]);
    const [recursoDialog, setRecursoDialog] = useState(false);
    const [deleteRecursoDialog, setDeleteRecursoDialog] = useState(false);
    const [deleteRecursosDialog, setDeleteRecursosDialog] = useState(false);
    const [recurso, setRecurso] = useState<Projeto.Recurso>(perfilUsuarioVazio);
    const [selectedRecursos, setSelectedRecursos] = useState<Projeto.Recurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [usuarios, setUsuarios] = useState<Projeto.Usuario[]| null>(null);
    const [perfis, setPerfis] = useState<Projeto.Perfil[] | null>(null);

    const perfiUsuarioService = new PerfilUsuarioService;
    const [refreshKey, setRefreshKey] = useState(0);
    
    useEffect(() => {
        
       PerfilUsuarioService.listarTodos();

             .then((response) => {
                 setRecursos(response.data)
             })
             .catch((error) => {
                 console.log(error);
            })
    },
    [refreshKey]);

    const openNew = () => {
        setRecurso(recursoVazio);
        setSubmitted(false);
        setRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRecursoDialog(false);
    };

    const hideDeleteRecursoDialog = () => {
        setDeleteRecursoDialog(false);
    };

    const hideDeleteRecursosDialog = () => {
        setDeleteRecursosDialog(false);
    };

    const saveRecurso = () => {
       let _recursos = (recursos as any)?.filter((val: any) => val.id !== recurso.id);

        setSubmitted(true);
        if(!recurso.id){
            recursoService.inserir(recurso)
                .then((response) => {
                    setRecursoDialog(false);
                    setRecurso(recursoVazio);
                    setRecursos(_recursos);
                    setRefreshKey(oldKey => oldKey +1)

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Recurso cadastrado com sucesso!',
                        life: 3000
                    });
                }).catch((error) => {
                    console.log(error.data);
                    setRecurso(recursoVazio);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Ocorreu um erro ao cadastrar Recurso, verifique!',
                        life: 3000
                    });               
                })

        }
        else {
            recursoService.alterar(recurso)
            .then((response) => {
                console.log(recurso);
                setRecursoDialog(false);
                setRecursos(_recursos);
                setRefreshKey(oldKey => oldKey +1)
            toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Recurso Alterado com sucesso!',
                    life: 3000
                });
            }).catch((error) => {
                setRecurso(recursoVazio);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Ocorreu um erro ao Alterar Recurso, verifique!',
                    life: 3000
                });               
            });
        }

    };

    const editRecurso = (recurso: Projeto.Recurso) => {
        setRecurso({ ...recurso });
        setRecursoDialog(true);
    };

    const confirmDeleteRecurso = (recurso: Projeto.Recurso) => {
        setRecurso(recurso);
        setDeleteRecursoDialog(true);
    };

    const deleteRecurso = () => {
        let _recursos = (recursos as any)?.filter((val: any) => val.id !== recurso.id);

        recursoService.excluir(Number(recurso.id))
            .then((response) => {
                setDeleteRecursoDialog(false);
                setRecurso(recursoVazio);
                setRecursos(_recursos);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Recurso Excluido!',
                    life: 3000
                })

             }).catch((error) => {
                setRecurso(recursoVazio);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Ocorreu um erro ao Exluir Recurso, verifique!',
                    life: 3000
                });               
             });

    };

    const exportCSV = () => {

        dt.current?.exportCSV();

    };

    const confirmDeleteSelected = () => {

        setDeleteRecursosDialog(true);
    };

     const deleteSelectedRecursos = () => {
        let _recursos = (recursos as any)?.filter((val: any) => !(selectedRecursos as any)?.includes(val));
        setRecursos(_recursos);
        Promise.all(selectedRecursos.map(async (_recursos) =>{
            await recursoService.excluir(_recursos.id);
        })).then((response) => {
            setDeleteRecursosDialog(false);
            //setSelectedUsuarios(null);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Recursos Excluidos!',
                life: 3000
             })

         }).catch((error) => {
            setRecurso(recursoVazio);
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: 'Ocorreu um erro ao Exluir Recursos, verifique!',
                life: 3000
            });               
     
         });
 
 
    };

      const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nome: string) => {
          const val = (e.target && e.target.value) || '';
          let _recurso = { ...recurso };
          _recurso[`${nome}`] = val;

          setRecurso(_recurso);
      };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRecursos || !(selectedRecursos as any).length} />
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

    const idBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const loginBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Chave</span>
                {rowData.chave}
            </>
        );
    };
    const actionBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamentos de Recursos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const recursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveRecurso} />
        </>
    );
    const deleteRecursoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteRecurso} />
        </>
    );
    const deleteRecursosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedRecursos} />
        </>
    );

    return (
        <div className="grid Recurso-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={recursos}
                        selection={selectedRecursos}
                        onSelectionChange={(e) => setSelectedRecursos(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Recursos"
                        globalFilter={globalFilter}
                        emptyMessage="Recursos não encontrado!."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="chave" header="Chave" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={recursoDialog} style={{ width: '450px' }} header="Detalhes do Recursos" modal className="p-fluid" footer={recursoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={recurso.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.nome
                                })}
                            />
                            {submitted && !recurso.nome && <small className="p-invalid">Nome é necessario!.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="chave">Chave</label>
                            <InputText
                                id="chave"
                                value={recurso.chave}
                                onChange={(e) => onInputChange(e, 'chave')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.chave
                                })}
                            />
                            {submitted && !recurso.chave && <small className="p-invalid">Chave é necessario!.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteRecursoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRecursoDialogFooter} onHide={hideDeleteRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && (
                                <span>
                                    Are you sure you want to delete <b>{recurso.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRecursosDialogFooter} onHide={hideDeleteRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && <span>Tem certeza que deseja excluir os Recursos selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Recurso;
