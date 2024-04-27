import { tables, views, procedures } from "../data/options";

export default function getEndpoint (name: any, param: any) {
    console.log(param);
    if (tables.includes(name))
        return `https://api-bd2.vercel.app/consulta/${name}`;
    if (views.includes(name))
        return `https://api-bd2.vercel.app/view/${name}`;
    if (procedures.includes(name))
        return `https://api-bd2.vercel.app/procedure/${name}${param ? `/${param}` : ""}`;
    else
        return null;
}