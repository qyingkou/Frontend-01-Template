class Response {
  constructor(options) {}
}
/* 整个消息的解析 */
class ResponseParse {
  constructor() {
    /* 定义状态 */
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;
    this.END = 8;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParse = null;
  }
  get isFinished() {
    return this.bodyParse && this.bodyParse.END;
  }
  get response() {
    this.statusLine.match(/HTTP\/[\d]+\.[\d]+ ([0-9]+) (.+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParse.content.join(""),
    };
  }
  receive(chunkStr) {
    for (let i of chunkStr) {
      if (this.current === this.END) return;
      this.receiveChar(i);
    }
  }
  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      // console.log("WAITING_STATUS_LINE");
      if (char === "\r") {
        this.current = this.WAITING_STATUS_LINE_END;
      } else if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      } else {
        this.statusLine += char;
      }
      return;
    }
    if (this.current === this.WAITING_STATUS_LINE_END) {
      // console.log("WAITING_STATUS_LINE_END");
      if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      }
      return;
    }
    if (this.current === this.WAITING_HEADER_NAME) {
      // console.log("WAITING_HEADER_NAME");
      if (char === ":") {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        this.current = this.WAITING_HEADER_BLOCK_END;
      } else {
        this.headerName += char;
      }
      return;
    }
    if (this.current === this.WAITING_HEADER_SPACE) {
      // console.log("WAITING_HEADER_SPACE");
      if (char === " ") {
        this.current = this.WAITING_HEADER_VALUE;
      }
      return;
    }
    if (this.current === this.WAITING_HEADER_VALUE) {
      // console.log("WAITING_HEADER_VALUE");
      if (char === "\r") {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
      return;
    }
    if (this.current === this.WAITING_HEADER_LINE_END) {
      // console.log("WAITING_HEADER_LINE_END");
      if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      }
      return;
    }
    if (this.current === this.WAITING_HEADER_BLOCK_END) {
      // console.log("===WAITING_HEADER_BLOCK_END===");
      if (char === "\n") {
        this.current = this.WAITING_BODY;
        this.bodyParse = new ResponseBodyParse();
      }
      return;
    }
    if (this.current === this.WAITING_BODY) {
      // console.log("WAITING_BODY");
      this.bodyParse.receiveChar(char);
      if (this.bodyParse.current === this.bodyParse.END) {
        this.current = this.END;
      } else {
        return;
      }
    }
    if (this.current === this.END) {
      // console.log(char);
      // console.log("end-length:", this.bodyParse.totalLength);
    }
  }
}
/* 消息体（Chunked）解析 */
class ResponseBodyParse {
  constructor() {
    this.WAITING_LENGTH_FIRSTCHAR = 0;
    this.WAITING_LENGTH = 1;
    this.WAITING_LENGTH_LINE_END = 2;
    this.READING = 3;
    this.READING_LINE_END = 4;
    this.END = 5;

    this.current = this.WAITING_LENGTH_FIRSTCHAR;
    this.chunkLength = 0;
    this.totalLength = 0;
    this.content = []; // 为提高性能
  }
  receiveChar(char) {
    if (this.current === this.END) return;
    if (this.current === this.WAITING_LENGTH_FIRSTCHAR) {
      if (char === "0") {
        this.current = this.END;
      } else if (char === "\r") {
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        this.current = this.WAITING_LENGTH;
        this.chunkLength *= 16;
        this.chunkLength += this.hexCharToHexDigit(char);
      }
      return;
    }
    if (this.current === this.WAITING_LENGTH) {
      if (char === "\r") {
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        this.chunkLength *= 16;
        this.chunkLength += this.hexCharToHexDigit(char);
      }
      return;
    }
    if (this.current === this.WAITING_LENGTH_LINE_END) {
      this.totalLength += this.chunkLength;
      this.chunkLength = 0;
      if (char === "\n") {
        this.current = this.READING;
      }
      return;
    }
    if (this.current === this.READING) {
      if (char === "\r") {
        this.current = this.READING_LINE_END;
      } else {
        this.content.push(char);
      }
      return;
    }
    if (this.current === this.READING_LINE_END) {
      // console.log("READING_LINE_END");
      if (char === "\n") {
        this.current = this.WAITING_LENGTH_FIRSTCHAR;
      }
      return;
    }
  }
  hexCharToHexDigit(char) {
    const codepoint = char.codePointAt();
    const codepoint_0 = "0".codePointAt();
    const codepoint_a = "a".codePointAt();
    let hexDigit = 0x0;
    if (codepoint >= codepoint_a) {
      hexDigit = char.toLowerCase().codePointAt() - codepoint_a + 10;
    } else if (codepoint >= codepoint_0) {
      hexDigit = char.codePointAt() - codepoint_0;
    }
    return hexDigit;
  }
}
module.exports = {
  Response,
  ResponseParse,
  ResponseBodyParse,
};
