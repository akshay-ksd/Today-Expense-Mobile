import _ from "lodash";

const properties = [
    { location: 'City Center', price: 250000, bedrooms: 2 },
    { location: 'Suburbs', price: 300000, bedrooms: 3 },
    { location: 'City Center', price: 350000, bedrooms: 3 }
];

const filters = {
    location: 'City Center',
    bedrooms: 3
};

//Native Javascript Code

const filteredProperties = properties.filter(property => 
    Object.keys(filters).every(key => property[key] === filters[key])
);

//Using Lodash

const filteredProperties1 = _.filter(properties, _.conforms(filters));