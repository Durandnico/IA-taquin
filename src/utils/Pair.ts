import { spawn } from "child_process";

export default class Pair<A, B>{
  private _first:A
  private _second:B

  public constructor(first_:A, second_:B) {
    this._first = first_;
    this._second = second_;
  }

  public set first(val : A) {
    this._first = val;
  }

  public set second(val: B) {
    this._second = val;
  }

  public get first(){
    return this._first
  }

  public get second(){
    return this._second;
  }

  public static swap<A,B>(vec : Pair<A,B>, vec2 : Pair<A,B>) {
    let tmp : A = vec.first;
    let tmp2 : B= vec.second;

    vec.first = vec2.first;
    vec.second = vec2.second;
    
    vec2.first = tmp;
    vec2.second = tmp2;
  }

}