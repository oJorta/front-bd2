"use client";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { InputNumber } from 'primereact/inputnumber';

import getEndpoint from "@/functions/getEndpoint";

export default function Home() {
  const [selectedTable, setSelectedTable] = useState(null) as any;
  const [tables, setTables] = useState([
    { name: "VIEW v_aluno_disciplina", code: "v_aluno_disciplina" },
    { name: "PROC ExibirMediasDisciplina", code: "ExibirMediasDisciplina" },
  ]) as any;
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [value1, setValue1] = useState(0) as any;

  useEffect(() => {
    const getTableNames = async () => {
      const response = await fetch("https://api-bd2.vercel.app/tabelas");
      const data = await response.json();
      const tableNames = data.map((table: any) => ({ name: table, code: table}));
      setTables(tables.concat(tableNames));
      
    };
    getTableNames();
    /* setTables([
      ...tables,
      { name: "VIEW v_aluno_disciplina", code: "v_aluno_disciplina" },
      { name: "PROC ExibirMediasDisciplina", code: "ExibirMediasDisciplina" },
    ]) */
  }, []);

  const getTableData = async () => {
    setLoading(true);
    let url = getEndpoint(selectedTable?.code, selectedTable?.code == "ExibirMediasDisciplina" ? `${value1}` : null);

    if (!url) {
      alert("Tabela não encontrada");
      setLoading(false);
      return;
    }
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    selectedTable?.code == "ExibirMediasDisciplina" ? setTableData(data[0]) : setTableData(data)
    setLoading(false)
  };

  return (
    <div className="w-11/12 flex flex-col justify-center items-center pt-4 mx-auto my-0">
      <header className=" text-center">
        <h1>Sistema Acadêmico 🏫📘👨🏻‍🎓👩🏾‍🎓</h1>
        <p>Banco de dados II</p>
      </header>
      <main className="w-full pt-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <Dropdown
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.value)}
              options={tables}
              optionLabel="name"
              placeholder="Selecione uma tabela"
              className="w-full max-w-md md:w-14rem"
            />

            {selectedTable?.code == "ExibirMediasDisciplina" && (
              <InputNumber
                inputId="integeronly"
                value={value1}
                className="w-1/5"
                onValueChange={(e) => setValue1(e.value)}
              />
            )}

            <Button
              label="Atualizar"
              icon="pi pi-refresh"
              className="w-full"
              loading={loading}
              onClick={() => getTableData()}
            />
          </div>

          <DataTable
            value={tableData}
            tableStyle={{ minWidth: "50rem" }}
            size="normal"
            stripedRows
            scrollable
            paginator
            rows={10}
          >
            {tableData &&
              Object.keys(tableData[0]).map((column, i) => (
                <Column key={i} field={column} header={column} />
              ))}
          </DataTable>
        </div>
      </main>
    </div>
  );
}
