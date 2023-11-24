export default class TimeDiff <T>{
  private readonly _time: number;
  private readonly _value: T;
  
  public constructor(fct: Function, ...args:any) {
    const start: number = new Date().getTime();
    
    this._value = fct(...args);
    this._time = new Date().getTime() - start;
  }

  get time() : number {
    return this._time;
  }

  get value(): T {
    return this._value;
  }
}