import React, { Component } from 'react'
import  "../App.css";
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';

export default class TodoApp extends Component {
    constructor(props) {
        super(props);
        this.state = 
        { 
          items: localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[],
          itemSelected: null,
          type:'Add'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
        render() {
            return (
              <div>
                <h3>TODO</h3>
               
                  <div className="todoListMain">
      <div className="header">
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="new-todo">
                    What needs to be done?
                  </label>
                  <input
                    id="new-todo"
                    onChange={this.handleChange}
                    value={this.state.itemSelected?this.state.itemSelected.text:""}
                  />
                  <button>
                    {this.state.type}
                  </button>
                </form>
            </div>
            <TodoList items={this.state.items} 
                            edit={(item)=> this.edit(item)}
                            delete={(item)=> this.delete(item)}
                            />
            </div>               
              </div>
            );
          }
          edit(item){
            this.setState({ itemSelected: item, type :"Save" });
          }

          delete(item){
              let index = this.state.items.indexOf(item);
              let tempItems = this.state.items;
              tempItems.splice(index,1);
            this.setState ({
                items: tempItems,
                text: ''
              },()=>{
                  localStorage.setItem("list",JSON.stringify(this.state.items))
              });
          }

          handleChange(e) {
            const newItem = {
                text: e.target.value,
                id:this.state.itemSelected? this.state.itemSelected.id:""
                };
            this.setState({ itemSelected : newItem });
          }
        
          handleSubmit(e) {
            e.preventDefault();
            if(this.state.type === "Add")
            {
                if (this.state.itemSelected && this.state.itemSelected.text.length === 0) {
                return;
                }
                const newItem = {
                    text: this.state.itemSelected.text,
                    id: Date.now()
                };
                this.setState(state => ({
                    items: state.items.concat(newItem),
                    itemSelected: null
                }),()=>{
                    localStorage.setItem("list",JSON.stringify(this.state.items))
                });
            }
            else{
                let tempItems = this.state.items
               for(let i=0;i<tempItems.length;i++){
                   if(tempItems[i].id === this.state.itemSelected.id){
                    tempItems[i].text= this.state.itemSelected.text;
                   }
               }
               this.setState(
                   {
                       items:tempItems,
                       itemSelected: null,
                       type:"Add"
                    },()=>{
                    localStorage.setItem("list",JSON.stringify(this.state.items))
                });

            }
    }
}

class TodoList extends React.Component {
    render() {
      return (
        <ul className="theList">
          {this.props.items.map(item => (
            <li key={item.id}>{item.text}
            <PrimaryButton text="Edit" onClick={()=> this.props.edit(item)} allowDisabledFocus  />
     
            {/* <button onClick={()=> this.props.edit(item)}> Edit </button> */}
            <button onClick={()=> this.props.delete(item)}> Delete </button>
            </li>
          ))}
        </ul>
      );
    }
  }
