import express from 'express';

const router = express.Router();

// Mock sales data
let sales = []; // Array to hold sales data

// GET all sales
router.get('/sales', (req, res) => {
    const { dateFrom, dateTo, customer } = req.query;
    let filteredSales = sales;

    if (dateFrom || dateTo) {
        filteredSales = filteredSales.filter(sale => {
            const saleDate = new Date(sale.date);
            return (!dateFrom || saleDate >= new Date(dateFrom)) && (!dateTo || saleDate <= new Date(dateTo));
        });
    }

    if (customer) {
        filteredSales = filteredSales.filter(sale => sale.customer.toLowerCase().includes(customer.toLowerCase()));
    }

    res.json(filteredSales);
});

// GET sale by ID
router.get('/sales/:id', (req, res) => {
    const sale = sales.find(s => s.id === parseInt(req.params.id));
    if (sale) {
        res.json(sale);
    } else {
        res.status(404).json({ message: 'Sale not found' });
    }
});

// POST create sale
router.post('/sales', (req, res) => {
    const { customer, items } = req.body;
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const igv = subtotal * 0.18; // 18% IGV
    const total = subtotal + igv;

    const newSale = {
        id: sales.length + 1,
        customer,
        items,
        subtotal,
        igv,
        total,
        date: new Date()
    };

    sales.push(newSale);
    res.status(201).json(newSale);
});

// PUT update sale
router.put('/sales/:id', (req, res) => {
    const index = sales.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        const { customer, items } = req.body;
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        sales[index] = { id: parseInt(req.params.id), customer, items, subtotal, igv, total, date: sales[index].date };
        res.json(sales[index]);
    } else {
        res.status(404).json({ message: 'Sale not found' });
    }
});

// DELETE sale
router.delete('/sales/:id', (req, res) => {
    const index = sales.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        sales.splice(index, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'Sale not found' });
    }
});

export default router;
