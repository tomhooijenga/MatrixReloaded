# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-17 10:02
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_auto_20160316_1436'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='visible_from',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='note',
            name='visible_until',
            field=models.DateField(default=None, null=True),
        ),
    ]
