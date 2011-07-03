# -*- encoding: utf-8 -*-

from django.test import TestCase
from transactions.models import Account
from django.utils.datetime_safe import date
from decimal import Decimal

def transaction_to_dict(transaction, keys=['account_id', 'transaction_date', 'currency_date', 'reference', 'text', 'value']):
    return dict([(key, getattr(transaction, key)) for key in keys])

class AccountImportTest(TestCase):
    maxDiff = None
    def test_import_single_row_with_balance(self):
        account = Account(name="test", number="1234", id=1)

        expected_transaction = {'account_id': 1,
                                'transaction_date': date(2011,03,31),
                                'currency_date': date(2011,03,31),
                                'reference': 5484535483,
                                'text': u'SKISTAR AB  /11-03-30',
                                'value': -2980.00}
        
        account.import_data("2011-03-31\t2011-03-31\t5484535483\tSKISTAR AB  /11-03-30\t-2980\t6960,04")
        self.assertQuerysetEqual(account.transaction_set.all(), [expected_transaction], transaction_to_dict)
        
    def test_import_single_row_without_balance(self):
        account = Account(name="test", number="1234", id=1)

        expected_transaction = {'account_id': 1,
                                'transaction_date': date(2011,03,31),
                                'currency_date': date(2011,03,31),
                                'reference': 5484535483,
                                'text': u'SKISTAR AB  /11-03-30',
                                'value': -2980.00}
        
        account.import_data("2011-03-31\t2011-03-31\t5484535483\tSKISTAR AB  /11-03-30\t-2980")
        self.assertQuerysetEqual(account.transaction_set.all(), [expected_transaction], transaction_to_dict)
        
    def test_import_multiple_rows(self):
        account = Account(name="test", number="1234", id=1)

        expected_transactions = [{'account_id': 1,
                                 'transaction_date': date(2011,03,24),
                                 'currency_date': date(2011,03,24),
                                 'reference': 5484478982,
                                 'text': u'COOP NARA VA/11-03-22',
                                 'value': Decimal("-280.22")},
                                 {'account_id': 1,
                                 'transaction_date': date(2011,03,25),
                                 'currency_date': date(2011,03,25),
                                 'reference': 5490966600,
                                 'text': u'LÖN',
                                 'value': Decimal("21320")},
                                 ]
        account.import_data("2011-03-25\t2011-03-25\t5490966600\tLÖN\t21320\t21486,98\n" +
                            "2011-03-24\t2011-03-24\t5484478982\tCOOP NARA VA/11-03-22\t-280,22\t166,98\n")
        self.assertQuerysetEqual(account.transaction_set.all(), expected_transactions, transaction_to_dict)
        