from django.db import models
from decimal import Decimal
import re

class Account(models.Model):
    number = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=100)
    initial_balance = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    
    class Meta:
        ordering = ['name']
        
    def import_data(self, data):
        lines = data.split('\n')
        lines.reverse()
        for line in lines:
            fields = line.split("\t")
            if len(fields) == 1:
                continue
            if len(fields)< 5 or len(fields) > 6:
                raise ValueError("Wrong number of fields, expected 5 or 6:", fields)
            t = self.transaction_set.create(transaction_date=fields[0],
                                            currency_date=fields[1],
                                            reference=int(fields[2]),
                                            text=fields[3],
                                            value=Decimal(fields[4].replace(",", ".")))
            t.auto_tag()
        self.save()
    import_data.alters_data = True
    
    def __unicode__(self):
        return self.number + " (" + self.name + ")"
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', null=True, blank=True)
    
    def __unicode__(self):
        return (self.parent.name if self.parent else "") + "/" + self.name
    
class Transaction(models.Model):
    transaction_date = models.DateField()
    currency_date = models.DateField()
    reference = models.BigIntegerField()
    account = models.ForeignKey(Account)
    text = models.CharField(max_length=100)
    value = models.DecimalField(decimal_places=2, max_digits=10)
    categories = models.ManyToManyField(Category)
    
    class Meta:
        ordering = ['account', 'transaction_date', 'id']
        unique_together = ('reference', 'transaction_date', 'text')
        
    def __unicode__(self):
        return str(self.currency_date) + " " + str(self.value) + " " + self.text
    
    def auto_tag(self):
        #TODO: is there a better way?
        matching_tags = [mapping.category for mapping in CategoryMapping.objects.all() if re.match(mapping.matcher, self.text, re.UNICODE | re.IGNORECASE)]
        self.categories.add(*matching_tags)
    auto_tag.alters_data = True
        
class CategoryMapping(models.Model):
    matcher = models.CharField(max_length=100)
    category = models.ForeignKey(Category)

