import { tables, views, procedures } from "../data/options";

export default function getEndpoint (name: any, param: any) {
    if (tables.includes(name))
        return `http://localhost:3001/consulta/${name}`;
    if (views.includes(name))
        return `http://localhost:3001/view/${name}`;
    if (procedures.includes(name))
        if(name === 'analizar_horas_professores')
            return `http://localhost:3001/procedure/${name}`;
        else
            return `http://localhost:3001/procedure/${name}${param ? `/${param}` : ""}`;
    else
        return null;
}