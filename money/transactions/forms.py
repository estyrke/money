from django import forms

class ImportForm(forms.Form):
    import_data = forms.CharField(widget=forms.Textarea)