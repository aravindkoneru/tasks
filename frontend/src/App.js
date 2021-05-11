import './App.css';
import "react-datepicker/dist/react-datepicker.css";

import React, { Component } from "react";
import DatePicker from "react-datepicker";
import Modal from "./components/Modal";
import axios from "./utils/axios";

class App extends Component {
    constructor(props) {
        super(props);
        const currentDate = new Date()
        this.state = {
            viewCompleted: false,
            todoList: [],
            modal: false,
            activeItem: {
                title: "",
                description: "",
                completed: false,
                created_at: null,
                edited_at: null,
            },
            date: currentDate
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        let params = {"date": this.state.date}
        console.log("params: " , params)

        axios
            .get("/api/todos/", {params})
            .then((res)=> this.setState( {todoList: res.data }))
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item) => {
        this.toggle();

        console.log("submitting: ", item)

        if (item.id) {
            axios
                .put(`/api/todos/${item.id}/`, item)
                .then((res) => this.refreshList())
                .catch((err) => console.log(err));
            return;
        }

        axios
            .post("/api/todos/", item)
            .then((res) => this.refreshList())
            .catch((err) => console.log(err));
    };

    deleteItem = (item) => {
        axios
            .delete(`/api/todos/${item.id}`)
            .then((res) => this.refreshList());
    };

    createItem = () => {
        const item = {title: "", description: "", completed: false, created_at: this.state.date.toISOString()};

        this.setState( {activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    displayCompleted = (status) => {
        if (status) {
            return this.setState({viewCompleted: true});
        }

        return this.setState({viewCompleted: false});
    };

    loadForDate = (date) => {
        this.setState({ date: date }, this.refreshList);
    };

    renderTabList = () => {
        return (
            <div className="nav nav-tabs">
                <span
                    className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(true)}
                >
                    Complete
                </span>
                <span
                    className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
                    onClick={() => this.displayCompleted(false)}
                >
                    Incomplete
                </span>
            </div>
        );
    };

    renderItems = () => {
        const { viewCompleted } = this.state;
        const newItems = this.state.todoList.filter(
            (item) => item.completed === viewCompleted
        );

        return newItems.map((item) => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
                <span
                    className={`todo-title mr-2 ${
                        this.state.viewCompleted ? "completed-todo" : ""
                    }`}
                    title={item.description}
                >
                    {item.title}
                </span>
                <span>
                    <button
                        className="btn btn-secondary mr-2"
                        onClick={()=> this.editItem(item)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => this.deleteItem(item)}
                    >
                        Delete
                    </button>
                </span>
            </li>
        ));
    };

    render() {
        return (
            <main className="container">
                <h1 className="text-black text-uppercase text-center my-4">Todo App</h1>
                <div className="row">
                    <div className="col">
                    </div>
                    <div className="col-md-auto">
                        <DatePicker 
                            closeOnScroll={true}
                            selected={this.state.date}
                            onChange={(date) => this.loadForDate(date)}
                            calendarClassName="rasta-stripes"
                        />
                    </div>
                    <div className="col">
                    </div>
                </div>



                <div className="row">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="mb-4">
                                <button
                                    className="btn btn-primary"
                                    onClick={()=> this.createItem()}
                                >
                                    Add task
                                </button>
                            </div>
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush border-top-0">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                {this.state.modal ? (
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ): null}
            </main>
        );
    }
}

export default App;
