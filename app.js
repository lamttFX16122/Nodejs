const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
// const expressHbs = require('express-handlebars');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

//ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// handlebars
// app.engine('hbs', expressHbs({ layoutsDir: './views/layouts/', defaultLayout: 'main-layout', extname: 'hbs' }));
// app.set('view engine', 'hbs');
// app.set('views', 'views');

// for Pug
// app.set('view engine', 'pug');
// app.set('views', 'views');

app.use('/admin', adminRouter.route);
app.use(shopRouter);

app.use((req, res) => {
        res.render('404.pug', { pageTitle: 'Page Not Found' })
    })
    // const server = http.createServer(app);
app.listen(8099);