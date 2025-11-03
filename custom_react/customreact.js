function customrender(reactelement,container){
    const {type,props,children}=reactelement
//     const domelement=document.createElement(reactelement.type)//khali container ban gaya
//     domelement.innerHTML=reactElement.children
//     domelement.setAttribute('id',props.id)
//     domelement.setAttribute('target',props.target)
//     container.appendChild(domelement)
// 
    const domElemnet= document.createElement(reactelement.type)
    domElemnet.innerHTML=reactelement.children
    for(const prop in reactelement.props){
        if(prop == 'children') continue;
        domElemnet.setAttribute(prop,reactelement.props[prop])
    }
    container.appendchlid(domElemnet)
}
const reactelement={
    type : 'h1',
    props: {
        id: 'this is my id',
        target: '_blank'
    },
     children: 'Hello World'
}

const maincontainer=document.querySelector('#root')
customrender(reactelement,maincontainer)
