import React from 'react';
import Style from './Box.module.sass'
export default function Box() {
  return (
    <div>
      <p className={Style.box}>Box</p>
    </div>
  );
}
