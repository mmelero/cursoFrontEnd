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
import { PerfilService } from '@/service/PerfilService'; 

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Perfil = () => {
    let perfilVazio: Projeto.Perfil = {
        id:    '',
         descricao: ''
    };

    const [perfils, setPerfils] = useState([]);
    const [perfilDialog, setPerfilDialog] = useState(false);
    const [deletePerfilDialog, setDeletePerfilDialog] = useState(false);
    const [deletePerfilsDialog, setDeletePerfilsDialog] = useState(false);
    const [perfil, setPerfil] = useState<Projeto.Perfil>(perfilVazio);
    const [selectedPerfils, setSelectedPerfils] = useState<Projeto.Perfil[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilService = new PerfilService;
    const [refreshKey, setRefreshKey] = useState(0);
    
    useEffect(() => {
        
       perfilService.listarTodos()

             .then((response) => {
                 setPerfils(response.data)
             })
             .catch((error) => {
                 console.log(error);
            })
    },
    [refreshKey]);

    const openNew = () => {
        setPerfil(perfilVazio);
        setSubmitted(false);
        setPerfilDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilDialog(false);
    };

    const hideDeletePerfilDialog = () => {
        setDeletePerfilDialog(false);
    };

    const hideDeletePerfilsDialog = () => {
        setDeletePerfilsDialog(false);
    };

    const savePerfil = () => {
       let _perfils = (perfils as any)?.filter((val: any) => val.id !== perfil.id);

        setSubmitted(true);
        if(!perfil.id){
            perfilService.inserir(perfil)
                .then((response) => {
                    setPerfilDialog(false);
                    setPerfil(perfilVazio);
                    setPerfils(_perfils);
                    setRefreshKey(oldKey => oldKey +1)

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Perfil cadastrado com sucesso!',
                        life: 3000
                    });
                }).catch((error) => {
                    console.log(error.data);
                    setPerfil(perfilVazio);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Ocorreu um erro ao cadastrar Perfil, verifique!',
                        life: 3000
                    });               
                })

        }
        else {
            perfilService.alterar(perfil)
            .then((response) => {
                setPerfilDialog(false);
                setPerfils(_perfils);
                setRefreshKey(oldKey => oldKey +1)
            toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Perfil Alterado com sucesso!',
                    life: 3000
                });
            }).catch((error) => {
                setPerfil(perfilVazio);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Ocorreu um erro ao Alterar Perfil, verifique!',
                    life: 3000
                });               
            });
        }

    };

    const editPerfil = (perfil: Projeto.Perfil) => {
        setPerfil({ ...perfil });
        setPerfilDialog(true);
    };

    const confirmDeletePerfil = (perfil: Projeto.Perfil) => {
        setPerfil(perfil);
        setDeletePerfilDialog(true);
    };

    const deletePerfil = () => {
        let _perfils = (perfils as any)?.filter((val: any) => val.id !== perfil.id);

        perfilService.excluir(Number(perfil.id))
            .then((response) => {
                setDeletePerfilDialog(false);
                setPerfil(perfilVazio);
                setPerfils(_perfils);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Perfil Excluido!',
                    life: 3000
                })

             }).catch((error) => {
                setPerfil(perfilVazio);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Ocorreu um erro ao Exluir Perfil, verifique!',
                    life: 3000
                });               
             });

    };

    const exportCSV = () => {

        dt.current?.exportCSV();

    };

    const confirmDeleteSelected = () => {

        setDeletePerfilsDialog(true);
    };

     const deleteSelectedPerfils = () => {
        let _perfils = (perfils as any)?.filter((val: any) => !(selectedPerfils as any)?.includes(val));
        setPerfils(_perfils);
        Promise.all(selectedPerfils.map(async (_perfils) =>{
            await perfilService.excluir(_perfils.id);
        })).then((response) => {
            setDeletePerfilsDialog(false);
            //setSelectedUsuarios(null);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Perfils Excluidos!',
                life: 3000
             })

         }).catch((error) => {
            setPerfil(perfilVazio);
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: 'Ocorreu um erro ao Exluir Perfils, verifique!',
                life: 3000
            });               
     
         });
 
 
    };

      const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, descricao: string) => {
          const val = (e.target && e.target.value) || '';
          let _perfil = { ...perfil };
          _perfil[`${descricao}`] = val;

          setPerfil(_perfil);
      };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfils || !(selectedPerfils as any).length} />
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

    const idBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.descricao}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfil(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfil(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamentos de Perfils</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfil} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfil} />
        </>
    );
    const deletePerfilsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilsDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfils} />
        </>
    );

    return (
        <div className="grid Perfil-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfils}
                        selection={selectedPerfils}
                        onSelectionChange={(e) => setSelectedPerfils(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Perfils"
                        globalFilter={globalFilter}
                        emptyMessage="Perfils não encontrado!."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descricao" header="Descrição" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilDialog} style={{ width: '450px' }} header="Detalhes do Perfil" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="descricao">Descrição</label>
                            <InputText
                                id="descricao"
                                value={perfil.descricao}
                                onChange={(e) => onInputChange(e, 'descricao')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !perfil.descricao
                                })}
                            />
                            {submitted && !perfil.decricao && <small className="p-invalid">Descrição é necessario!.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && (
                                <span>
                                    Are you sure you want to delete <b>{perfil.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfilsDialogFooter} onHide={hideDeletePerfilsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && <span>Tem certeza que deseja excluir os Perfils selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
