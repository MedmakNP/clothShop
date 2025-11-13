import React from "react";

function ContactsPage() {
  
  const init ={
    damade: 60,
    attackSpeed: 0.5,
    name:''
  };
  Object.defineProperty(init, 'name', {
    value: 'aboba',
    writable: false
  });
  console.log(init)
  //init.name = '11'
  return (
    <>
    </>
  );
}

export default ContactsPage;
