export class Upload {
  public $key: string;
  public file: File;
  public name: string;
  public progress: number;
  public timestamp: Date = new Date();
  public url: string;

  constructor(file: File) {
    this.file = file;
  }
}
