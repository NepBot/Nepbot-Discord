/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-21 21:59:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-31 18:31:31
 * @ Description: i@rua.moe
 */

class LocalStore {
  private store: any;
  constructor(options: Object) {}

  public GetInputData({ data, options = {} }: { data: any; options?: Object }) {
    const newData = {
      data,
      keyInfo: Object.assign(options, {
        timestamp: new Date().getTime(),
      }),
    };

    return JSON.stringify(newData);
  }

  public GetOutputData({ data }: { data: any }) {
    return JSON.parse(data);
  }

  public GetData({ key }: { key: string }) {
    const data = localStorage.getItem(key);

    return this.GetOutputData({
      data,
    });
  }

  public GetKey({ key }: { key: string }) {
    return `${key}`;
  }

  public Remove({ key }: { key: string }) {
    localStorage.removeItem(key);
  }

  public IsExpired({ key }: { key: string }) {
    const { keyInfo } = this.GetData({
      key,
    });
    const { expires, timestamp } = keyInfo;

    if (!expires) {
      return true;
    }

    return timestamp + expires * 24 * 3600 * 1000 - new Date().getTime() < 0;
  }

  public Once({
    key,
    data,
    options = {},
  }: {
    key: string;
    data: any;
    options?: Object;
  }) {
    const _key = this.GetKey({
      key,
    });
    const _data = this.GetInputData({
      data,
      options: Object.assign(options, {
        isOnce: true,
      }),
    });

    localStorage.setItem(_key, _data);
  }

  public Get({ key }: { key: string }) {
    const _key = this.GetKey({
      key,
    });
    const _data = this.GetData({
      key: _key,
    });

    if (!_data) {
      return null;
    }

    if (this.IsExpired({ key: _key })) {
      this.Remove({ key: _key });

      return null;
    }

    if (_data.keyInfo.isOnce) {
      this.Remove({ key: _key });
    }

    return _data.data;
  }

  public Set({
    key,
    data,
    options = {},
  }: {
    key: string;
    data: any;
    options?: Object;
  }) {
    const _key = this.GetKey({
      key,
    });
    const _data = this.GetInputData({
      data,
      options,
    });

    localStorage.setItem(_key, _data);
  }

  public Clear() {
    localStorage.clear();
  }
}

const store = new LocalStore({});

export { store, LocalStore };
