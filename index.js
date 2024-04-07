import Freecurrencyapi from '@everapi/freecurrencyapi-js';

const freecurrencyapi = new Freecurrencyapi('fca_live_VbsGyIOCgvkyxiOyIe5bZQrYomFR7c0pYJf0gRpw');

// convertCurency('INR', 'USD', 3)
convertCurency( 'USD','INR', 3)


export async function convertCurency(fromCurrency, toCurrency, units) {

    const response = await freecurrencyapi.latest({
        base_currency: fromCurrency,
        currencies: toCurrency
    });
    const multiplier = response.data[toCurrency];
    return multiplier * units
    console.log(multiplier);            
}