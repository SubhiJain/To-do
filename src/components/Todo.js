import React, { Component } from 'react'
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Depths } from '@uifabric/fluent-theme';

export default class Todo extends Component {
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
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

     onChange (e,checked,item) {
       console.log(e,checked,item);
       let tempItems = this.state.items
       for(let i=0;i<tempItems.length;i++){
           if(tempItems[i].id === item.id){
            tempItems[i].status= tempItems[i].status === "Active"?"Complete":"Active";
            this.setState(
                {
                    items:tempItems,                   
                 },()=>{
                 localStorage.setItem("list",JSON.stringify(this.state.items))
             });
           }
       }
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
            id:this.state.itemSelected? this.state.itemSelected.id:"",
            status:"Active"
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
                id: Date.now(),
                status:this.state.itemSelected.status
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

    render() {
        let ActiveItems = this.state.items.filter((a)=> a.status === "Active");
        let CompleteItems = this.state.items.filter((a)=> a.status === "Complete");
        return (
            <div>
              <h3>TODO</h3>
            <Pivot aria-label="Large Link Size Pivot Example" linkSize={PivotLinkSize.large}>
              <PivotItem headerText="All">
              <div className="header">
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="new-todo">
                   Enter new to-do task : 
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
                            onChange={(e,checked,item)=> this.onChange(e,checked,item)}
                            />
              </PivotItem>
              <PivotItem headerText="Complete">
              <TodoList 
                            disabled = {true}
                            items={CompleteItems} 
                            edit={(item)=> this.edit(item)}
                            delete={(item)=> this.delete(item)}
                            onChange={(e,checked,item)=> this.onChange(e,checked,item)}
                            />
              </PivotItem>
              <PivotItem headerText="Active">
              <TodoList 
                            disabled = {true}
                            items={ActiveItems} 
                            edit={(item)=> this.edit(item)}
                            delete={(item)=> this.delete(item)}
                            onChange={(e,checked,item)=> this.onChange(e,checked,item)}
                            />
              </PivotItem>
            </Pivot>
          </div>
        )
    }
}


class TodoList extends React.Component {
    render() {
      return (
        <div style={{ boxShadow: Depths.depth8, padding: "15px" }}>
          {this.props.items.map(item => (
            <div key={item.id} style={{justifyContent:'center', display:'flex', alignItems:'center'}}>
                    <Checkbox 
                        label={item.text} 
                        checked={item.status === "Active"?false:true} 
                        onChange={(e,checked)=> this.props.onChange(e,checked,item)} 
                        styles={{root:{
                            padding:'5px'
                        },
                        label:{
                            padding:'6px'
                        }}}
                    />  
                    <PrimaryButton styles={{root:{marginLeft:'5px'}}} text="Edit" onClick={()=> this.props.edit(item)} allowDisabledFocus  />
                    <PrimaryButton styles={{root:{marginLeft:'5px'}}} text="Delete" onClick={()=> this.props.delete(item)} allowDisabledFocus  />
            </div>
          ))}
        </div>
      );
    }
  }
