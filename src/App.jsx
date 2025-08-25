/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import logo from './lemonadestand_b.png';
import logo_s from './lemonadestand_s.png';
import minus_btn from './minus.png';
import plus_btn from './plus.png';
import delete_btn from './delete.png';
import './App.css';
import CustomerForm from './CustomerForm';

function App() {

    const [lemonadeOption, setItems] = useState([]);
    const [count, setCount] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [customerId, setCustomerId] = useState(null);


    useEffect(() => {
        fetch("https://localhost:7078/LemonadeOption")
            .then((res) => res.json())
            .then((json) => {
                setItems(json);
                setCount(new Array(json.length).fill(0));
            });
    }, []);

    function incrementCount(rowIndex) {
        setCount(qs => qs.map((q, i) => i === rowIndex ? q + 1 : q));
    }

    function decrementCount(rowIndex) {
        setCount(qs => qs.map((q, i) => i === rowIndex ? q - 1 : q));
    }

    function resetCount(rowIndex) {
        /*setCount(new Array(count.length).fill(0));*/
        setCount(qs => qs.map((q, i) => i === rowIndex ? Math.max(0) : q));
    }

    function resetAllCounts() {
        setCount(new Array(lemonadeOption.length).fill(0));
    }


    function calculateTotalAmount(lemonadeOption, count) {
        return lemonadeOption.reduce((sum, item, idx) => {
            return sum + item.sizePrice * count[idx];
        }, 0);
    }

    function handleOrderSubmit() {
        const selectedItems = lemonadeOption
            .map((item, idx) => ({
                typeId: item.typeId,
                sizeId: item.sizeId,
                quantity: count[idx],
                price: item.sizePrice
            }))
            .filter(item => item.quantity > 0);

        if (selectedItems.length === 0) {
            alert("Please select at least one item.");
            return;
        }

        const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
        const orderPayload = {
            customerId: customerId,
            billValue: totalAmount,
            orderDetails: selectedItems.map(item => ({
                typeId: item.typeId,
                sizeId: item.sizeId,
                quantity: item.quantity
            }))
        };

        fetch("https://localhost:7078/Order/SaveOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderPayload)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to save order");
                return res.json();
            })
            .then(data => {
                console.log(orderPayload);
                alert("Order saved successfully!");
                resetAllCounts();
            })
            .catch(err => {
                console.error(err);
                alert("Error saving order.");
            });
    }


    return (
        <div className="App">
            {/*<header className="App-header">*/}

            {/*</header>*/}
            <main className="App-main">
                <img src={logo} className="App-logo" alt="Lemonade Stand Logo" />


                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Price</th>
                            <th>QTY</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {lemonadeOption.map((item, idx) => (
                            <tr key={item.typeFlavor + item.sizeName}>
                                <td><img src={logo_s} className="App-logo-small" alt="Lemonade Small Logo" /></td>
                                <td>
                                    <table>
                                        <tr>
                                            <td ><h4 className="App-item">{item.typeFlavor}</h4></td>
                                        </tr>
                                        <tr>
                                            <td><div className="App-item-desc">{item.sizeName}</div></td>
                                        </tr>
                                    </table>
                                </td>
                                <td>${item.sizePrice}</td>
                                <td>
                                    <table>
                                        <tr>
                                            <td><button onClick={() => decrementCount(idx)} disabled={count[idx] === 0} className="App-item-btn"><img className="App-item-btn-img" src={minus_btn} alt="minus btn" /></button></td>
                                            <td>{count[idx]}</td>
                                            <td><button onClick={() => incrementCount(idx)} className="App-item-btn"><img className="App-item-btn-img" src={plus_btn} alt="plus btn" /></button></td>
                                        </tr>
                                    </table>
                                </td>

                                <td>${(item.sizePrice * count[idx].toFixed(2))}</td>
                                <td><button onClick={() => resetCount(idx)} className="App-item-btn"><img className="App-item-btn-img" src={delete_btn} alt="delete btn" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <table>
                    <tr>
                        <td className="App-total"><h3>Total Amount: ${calculateTotalAmount(lemonadeOption, count).toFixed(2)}</h3></td>
                    </tr>
                </table>
                <CustomerForm
                    isOpen={showForm}
                    setIsOpen={setShowForm}
                    setCustomerId={setCustomerId}
                />
                <table>
                    <tr>
                        <td><button className="App-cta" onClick={() => setShowForm(true)}>Add Customer</button></td>
                        <td><button className="App-cta" onClick={handleOrderSubmit}> Order Now</button></td>
                    </tr>
                </table>
                
                
            </main>
        </div>
    );
}

export default App;

