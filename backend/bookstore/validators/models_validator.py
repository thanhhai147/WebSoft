from django.core.validators import RegexValidator

class AccountValidator:
    AccountName = RegexValidator(r'^[\w\d]+$')
    Password = RegexValidator(r'^[\w\d!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]*$')

class ConsumerValidator:
    Name = RegexValidator(r'^[\w\d\s]+$')
    Address = RegexValidator(r'^[\w\d\s!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]*$')
    Phone = RegexValidator(r'(84|0[3|5|7|8|9])+([0-9]{8})\b')