import 'primereact/resources/themes/vela-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useRef } from 'react';
import { Paginator } from 'primereact/paginator';
import { toast, ToastContainer } from 'react-toastify';
import { Button} from 'primereact/button';
import { InputMask } from 'primereact/inputmask';
import axios from 'axios';
// import { InputText } from 'primereact/inputtext';
//  import {mask, unMask} from 'remask';
import React from 'react';
import { Tag } from 'primereact/tag';
import './App.css';



const App: React.FC=()=>{
    const [cnpj, setCnpj] = useState<string>('');
    const [fCnpj, setFCnpj] = useState<string>('');
    const [user, setUser] = useState<string>('');
    const [transacoes, setTransacoes] = useState([]) ;
    const dt = useRef(null);
    const [first,setFirst] = useState(0);
    //**** Alteração para testes N4 ****

    const Search = async ()=>{
        toast.info('Buscando...',{
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        try {
          //http://192.168.1.60:3013/alfa/${cnpj}/10/${first}
          const {data} = await axios.get(`http://localhost:3013/${cnpj}/10/${first}`);
          console.log(cnpj);
          console.log(data);
          setTransacoes(data.cobrancas);
          setUser(data.usuario_nome);
          console.log(transacoes);
          if(!data){          
            setCnpj('');
            setTransacoes([]);
            toast.error('CNPJ não encontrado',{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }else{
            toast.success('Movimentações Encontradas',{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
        }
        } catch (err) {
          console.log(err);
          setCnpj('');
          setTransacoes([]);
          toast.error('Erro de Conexão com o Banco de Dados',{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        }
      }
      const Clean=()=>{
          setFCnpj('');
          setCnpj('');
          setTransacoes([]);
          toast.success('Busca Resetada',{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
      }

      const Mask = (value: string) => {
        // const AuxCnpj = mask((value), '99.999.999/9999-99');
        const Aux1 = (value).substring(0,2);
        const Aux2 = (value).substring(3,6);
        const Aux3 = (value).substring(7,10);
        const Aux4 = (value).substring(11,15);
        const Aux5 = (value).substring(16,18);
        const TCnpj = Aux1.concat(Aux2.concat(Aux3.concat(Aux4.concat(Aux5))));
        setCnpj(TCnpj);
        setFCnpj(value);
      }
      const handleKeyPress=(event:any)=>{
          if (event.key === 'Enter') {
              Search();
          }
      }
      const paymentBodyTemplate = (rowData: any) => {
        if(rowData.splits[0].tipo_pagamento === 'boleto'){
          return (
          <React.Fragment>
            <Tag className="p-mr-2" icon="pi pi-money-bill" severity="success" value="Boleto"></Tag>
          </React.Fragment>)}
          else{
          return (
            <React.Fragment>
            <Tag className="p-mr-2" icon="pi pi-credit-card" severity="info" value="Cartão"></Tag>
          </React.Fragment>)}
          
          } 
    const cobranca_id = (rowData: any) => {
      return(
      rowData.cobranca_id
  )
  } 
    const cobranca_descricao = (rowData: any) => {
      return(
      rowData.cobranca_descricao
  )
  } 
    const split_direto = (rowData: any) => {
      return(
      rowData.splits[0].splits_valor_direto
  )
  } 
    const split_provider = (rowData: any) => {
      return(
      rowData.splits[0].splits_valor_provider
  )
  } 
    const split_protesto = (rowData: any) => {
      return(
      rowData.splits[0].splits_valor_protesto
  )
  } 
    const ht_data = (rowData: any) => {
      return(
      rowData.splits[0].historico.ht_data
  )
  } 
          

    return(
        <div>
          <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
            <div style={{padding:"20px 20px 20px 20px",alignItems:"center",justifyContent:"center", textAlign:"center"}}>
            <label form = "fCnpj" ><b>Digite o Nº do CNPJ que deseja buscar: </b></label>
            <InputMask value={fCnpj} mask="99.999.999/9999-99" onChange={(e) => Mask(e.target.value)} placeholder="99.999.999/9999-99" />
            <Button id="search" label="BUSCAR" style={{marginLeft:"10px"}} icon="pi pi-search" onClick={Search}/>
            <Button label="LIMPAR" style={{marginLeft:"10px"}} icon="pi pi-trash" onClick={Clean}/>
            </div>
            <DataTable ref={dt} value={transacoes} header={user}
            className="p-datatable-customers" dataKey="cobranca_id" rowHover
            emptyMessage="Nenhuma movimentação financeira encontrada." >
                <Column body={cobranca_descricao} header="Descrição da Cobrança"/>
                <Column body={cobranca_id} header="ID da Cobrança"/>
                <Column body={paymentBodyTemplate} header="Tipo de Pagamento"/>
                <Column body={split_direto} header="Split Direto"/>
                <Column body={split_provider} header="Split Provider"/>
                <Column body={split_protesto} header="Split Protesto"/>
                <Column body={ht_data} header="Data"/>

            </DataTable>
            <Paginator first={first} rows={10} onPageChange={(e) => setFirst(e.first)}></Paginator>
        </div>
    )

}

export default App;