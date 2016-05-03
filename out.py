from collections import OrderedDict, Callable
import re

class DefaultOrderedDict(OrderedDict):

    def __init__(self, default_factory=None, *a, **kw):
        if (default_factory is not None and
           not isinstance(default_factory, Callable)):
            raise TypeError('first argument must be callable')
        OrderedDict.__init__(self, *a, **kw)
        self.default_factory = default_factory

    def __getitem__(self, key):
        try:
            return OrderedDict.__getitem__(self, key)
        except KeyError:
            return self.__missing__(key)

    def __missing__(self, key):
        if self.default_factory is None:
            raise KeyError(key)
        self[key] = value = self.default_factory()
        return value

    def __reduce__(self):
        if self.default_factory is None:
            args = tuple()
        else:
            args = self.default_factory,
        return type(self), args, None, None, self.items()

    def copy(self):
        return self.__copy__()

    def __copy__(self):
        return type(self)(self.default_factory, self)

    def __deepcopy__(self, memo):
        import copy
        return type(self)(self.default_factory,
                          copy.deepcopy(self.items()))

    def __repr__(self):
        return 'OrderedDefaultDict(%s, %s)' % (self.default_factory,
                                               OrderedDict.__repr__(self))




d = [{'09:00 - 22:00': u'Monday'}, 
{'09:00 - 22:00': u'Tuesday'}, {'08:00 - 23:00': u'Wednesday'}, 
{'09:00 - 22:00': u'Thursday'}, {'09:00 - 22:00': u'Friday'}]

def comb_in_order(lst):
    for start in range(0, len(lst)):
        for end in range(len(lst), start, -1):
            yield lst[start:end]

ordered_lis = ['-'.join(c) for c in comb_in_order(['Monday', 'Tuesday', 'Wednesday', 'Thursday',
	              'Friday', 'Saturday', 'Sunday'])]



def shorten_days(days):
	if '-' in days:
		out = days.split('-')
		return out[0] + '-' + out[-1]

	return days


ordered_dic = {i: shorten_days(i) for i in ordered_lis}


v = DefaultOrderedDict(str)
for item in d:
	key = item.keys()[0]
	value = item.values()[0]

	if key not in v.keys():
	    v[key] +=  value
	else:
		v[key] +=  '-' + value


# Ordered list having atleast two items
# mod_order_lis = [i for i in ordered_lis if '-' in i]
# print ordered_dic

final_out = {}
for key, value in v.items():
	lis = ['-'.join(c) for c in comb_in_order(value.split('-'))]
	for i in lis:
		if '-' in i and i in ordered_dic:
			value = re.sub(i, ordered_dic[i] + '|', value)

	value = re.sub(r'\|-?', ',', value).strip(',')
	final_out[key] = value

print final_out