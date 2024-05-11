import React, {useState} from 'react'

function TableCell(props) {
    let [elements,setElements] = useState(createElem())
    let fieldsTypes = ["date","text", "number", "textarea", "checkbox"];

    function createHeader(){
        let headerFields = props.elem.map((el) => {
            let fields = []; 
            fieldsTypes.map((type)=>{
                for(let i = 0; i < 3 ; i++){
                    if(typeof(el[`${type}`+i]) != "undefined"){
                        fields.push((<th>{el[`${type}`+i]}</th>))
                    }
                }
            })
            return (
                <tr data-col_id={el.col_id}>
                    <th>{props.t("TableCell.Id")}</th>
                    <th>{props.t("TableCell.name")}</th>
                    <th>{props.t("TableCell.description")}</th>
                    <th>{props.t("TableCell.tags")}</th>
                    {fields}
                </tr>
            )
        })
        setElements(headerFields)
    }

    function createBody(){
        let headerFields = props.elem.map((el, index)=>{
            let fields = []; 
            fieldsTypes.map((type)=>{
                for(let i = 0; i < 3 ; i++){
                    if(typeof(el[`${type}`+i]) != "undefined"){
                        if(type == "checkbox"){
                            fields.push((<th>
                            <Form.Check // prettier-ignore
                                type="checkbox"
                                checked={el[`${type}`+i] == "true" ? true : false}
                            />
                            
                            </th>))
                            continue
                        }
                        fields.push((<th>{el[`${type}`+i]}</th>))
                    }
                }
            })
            return (
                <tr data-item_id={el.item_id} data-col_id={el.col_id}>
                    <th>{index+1}</th>
                    <th>{props.el.name}</th>
                    <th>{props.el.description}</th>
                    <th>{props.el.tags}</th>
                    {fields}
                </tr>
            )
        })
        setElements(headerFields)
    }

    function createElem(){
        let elements = props.type == "header" ? createHeader() : createBody();
        setElements(props.elem)
    }

    return (
        {elements}
    )
}

export default TableCell