 <h3 align="center"> Backend express nodejs Postgrest </h3>

  <p align="center">
backend for management system project
    <br />
    <a"#"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://devsign.lat">View Demo</a>
    ·
    <a href="https://github.com/zerontec/dexpressjs-postgres/issues/new?title=Error&body=Detalles_del_issue
">Report Bug</a>
    ·
    <a href="https://github.com/zerontec/expressjs-postgres/issues/new?title=Feature%20Request:%20Integración%20con%20API%20externa&body=Me%20gustaría%20tener%20una%20característica%20que%20permita%20integrar%20nuestro%20proyecto%20con%20la%20API%20externa%20para%20obtener%20datos%20en%20tiempo%20real.
">Request Feature</a>
  </p>
</div>


## About The Project

![](dektopApp.gif)

Backend 
characteristics
* User login Role Admin, sellers, Cashier
* Inventory Module
* Purchasing Module
* Sales Module
* Billing Module

Many more modules, to guarantee customized control in businesses




## Architecture

### Architecture Diagram

Here you can include a diagram that shows the general architecture of the project.

### Design patterns

The project follows the Model-View-Controller (MVC) design pattern to organize and structure the code in an efficient and modular manner.

Description of the MVC Pattern
Model
It represents the data structure and business logic of the project.
Interacts with the database to perform CRUD (Create, Read, Update, Delete) operations.
Examples of models in our project: User, Product, Order.
View
It is responsible for the presentation of information to the user.
In a backend project, views can be JSON or XML responses generated to be consumed by the frontend or client side.
In our case, views are API endpoints that return data in JSON format.
Controller
It acts as an intermediary between the Model and the View.
It handles user requests, interacts with the Model and returns the appropriate response through the View.
Main controllers in our project: UserController, ProductController, OrderController.

###Directory and File Structure

```plaintext
/backend
|-- /models
|   |-- user.js
|   |-- Services.js
|   |-- Seller.js
| much more model
|
|-- /controllers
|   |-- user.controller.js
|   |-- services.controller.js
|   |-- seller.controller.js
|
|-- /routes
|   |-- index.routes.js
|   |-- user.routes.js
|   |-- seller.routes.js
|   |--   
|
|-- app.js
|-- db.js
|-- routes.js


```

### Database

- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Models**: Users, Products, Orders
- **Relationships**:
   - A user can have multiple orders.
   - A product can belong to one or more orders.




<p align="right">(<a href="#readme-top">back to top</a>)</p>




### Built With

Here are the technologies with which the system was developed



* <code><img width="50" src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" alt="JavaScript" title="JavaScript"/></code>

* <code><img width="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/></code>

* <code><img width="50" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" title="Express"/></code>

* <code><img width="50" src="https://user-images.githubusercontent.com/25181517/117208740-bfb78400-adf5-11eb-97bb-09072b6bedfc.png" alt="PostgreSQL" title="PostgreSQL"/></code>


<p align="right">(<a href="#readme-top">back to top</a>)</p>





### Installation


2. Clone the repo
   ```sh
    git clone  https://github.com/zerontec/expressjs-postgres.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4.You should have Postgrest installed
   ```
   https://www.postgresql.org/download/
   ```

5.in the backend directory
   ```
   npm start 
   ```


  
<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- USAGE EXAMPLES 
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>-->



<!-- ROADMAP -->
## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@zeronleo](https://twitter.com/zeronleo) - devsignweb@gmail.com -leobertozeron@gmail.com

Project Link: [https://github.com/zerontec/deskGledah](https://github.com/zerontec/deskGledah)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

<!--
* [Choose an Open Source License](https://choosealicense.com)

* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->



