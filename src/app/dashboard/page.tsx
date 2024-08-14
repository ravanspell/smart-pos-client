"use client";

import { useState } from "react";

import {
  decrement,
  increment,
  incrementAsync,
  incrementByAmount,
  incrementIfOdd,
  selectCount,
  selectStatus,
} from "@/redux/slices/counterSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./counter/Counter.module.css";
import { Button } from "@/components/atoms/Button";
import { useToast } from "@/lib/hooks/useToast";

const Counter = () => {
  const {toast} = useToast()
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const status = useAppSelector(selectStatus);
  const [incrementAmount, setIncrementAmount] = useState("2");

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div className='flex flex-row justify-center align-middle'>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span aria-label="Count" className={styles.value}>
          {count}
        </span>
        <Button
          // className={styles.button}
          aria-label="Increment value"
          onClick={() => {
            toast({
              title: "this is sample toast",
              description: "Friday, February 10, 2023 at 5:57 PM",
            });
            dispatch(increment())}
          }
        >
          +
        </Button>
        <Button variant="outline">Button</Button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          type="number"
          onChange={(e) => {
            setIncrementAmount(e.target.value);
          }}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          disabled={status !== "idle"}
          onClick={() => dispatch(incrementAsync(incrementValue))}
        >
          Add Async
        </button>
        <button
          className={styles.button}
          onClick={() => {
            dispatch(incrementIfOdd(incrementValue));
          }}
        >
          Add If Odd
        </button>
      </div>
    </div>
  );
};

export default Counter;