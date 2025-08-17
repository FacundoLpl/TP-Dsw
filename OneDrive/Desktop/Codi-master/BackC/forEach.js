'use strict';

const words = ['Hi all', 'this are', 'high-order functions'];

const highOrderFunction = (value, index) =>
  console.log(
    `The value of the ${index + 1}° position is '${value}' and the whitespace is the ${
      value.indexOf(' ') + 1
    }° character of the sentence`
  );

words.forEach(highOrderFunction);