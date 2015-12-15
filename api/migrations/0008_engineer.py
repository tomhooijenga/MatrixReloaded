# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-15 12:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_product'),
    ]

    operations = [
        migrations.CreateModel(
            name='Engineer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee_number', models.CharField(max_length=20)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('droppoint', models.CharField(max_length=20)),
                ('phone', models.CharField(max_length=11)),
                ('email', models.EmailField(max_length=254)),
                ('vca_number', models.CharField(max_length=20)),
                ('vca_date', models.DateField()),
                ('car_type', models.CharField(max_length=100)),
                ('car_color', models.CharField(max_length=100)),
                ('license_plate', models.CharField(max_length=10)),
                ('street', models.CharField(max_length=100)),
                ('zip_code', models.CharField(max_length=10)),
                ('city', models.CharField(max_length=100)),
                ('is_active', models.BooleanField(db_index=True)),
                ('countries', models.ManyToManyField(related_name='engineers', to='api.Country')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='api.Country')),
            ],
        ),
    ]
