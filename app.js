const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

//ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRouter.route);
app.use(shopRouter);

app.use((req, res) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' })
})

app.listen(8099);