import { Component, Inject, OnInit } from '@angular/core';
import { flush } from '@angular/core/testing';

export abstract class Pf {
    public static IsNumber(value: any) {
        if (isNaN(value)) return true;
        return false;
    }
    public static CheckCode(value: any) {
        var format = /[a-zA-Z0-9]{8,}$/;
        return format.test(value);
    }

    public static CheckAccentedCharacters(value: any) {
        // var format = /[a-zA-Z0-9]$/;
        // var format = /[^((0-9)|(a-z)|(A-Z)|\s)]/;
        var format = /[@#$%^&*(),.?"":{}|<>]/;
        return format.test(value);
    }
    public static CheckOTP(value: any) {
        var format = /[0-9]{6,}$/;
        return format.test(value);
    }
    public static IsCharacter(value: any) {
        var format = /[ !#$%^&*()+\=\[\]{};':"\\|,<>\/?]/;
        return format.test(value);
    }
    public static CheckPassdord(value: any) {
        var format =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
        return format.test(value);
    }
    public static CheckPassword(value: any) {
        var format = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
        return format.test(value);
    }
    public static checkMail(value: any) {
        var format = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
        return format.test(value);
    }
    public static checkMobile(value: any) {
        var format = /[0-9]{10}/;
        // var format = /[0-9]{9}/;  
        return format.test(value);
    }
    public static checkDecimal(value: any) {
        var format = /^\d*\.?\d*$/;
        return format.test(value);
    }

    public static checkContactMobile(value: any) {
        if (this.checkMobile(value) != true && value.length == 10) {
            return true;
        } else {
            return false
        }
    }
    public static IsValidDate(date: Date) {
        return date instanceof Date && !isNaN(date.getTime());
    }
    public static DateToInt(date: Date) {
        if (this.IsValidDate(date))
            return parseInt(
                '' +
                date.getFullYear() +
                this.pad(date.getMonth() + 1) +
                this.pad(date.getDate())
            );
        return 0;
    }
    public static StringDateToInt(d: any) {
        return d.replace('-', '').replace('-', '');
    }
    // convertDDToISODate 202311 -> 2023-11-30
    public static convertDDToISODate(d: any) {
        let numberString = d.toString();
        const firstDayOfMonth = new Date(numberString);
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
        return lastDayOfMonth
    }
    // convertYYmmToISODate 202311 -> 2023-11-01
    public static convertYYmmToISODate(d: any) {
        let numberString = d.toString();
        return numberString?.replace(/(\d{4})(\d{2})/, '$1-$2-01');
    }

    public static convertToISODate(date: any): any {
        let dateString = date.toString()
        const year = dateString.slice(0, 4);
        const month = dateString.slice(4, 6);
        const day = dateString.slice(6, 8);
        return `${year}-${month}-${day}`;
    }

    public static firstDayInMonth(date: any): any {
        let currDate = new Date();
        let year = currDate.getFullYear();
        let month = currDate.getMonth()+ 1;
        let firstDay = '01';

        return date = `${firstDay}/${month>9?month:"0"+month}/${year}`; 
    }

    public static lastDayInMonth(date: any): any {
        let currDate = new Date();
        let year = currDate.getFullYear();
        let month = currDate.getMonth()+ 1;
        let lastDay = '';
        if (month === 2 && year % 4 === 0) {
            lastDay = "29"
        } else if (month === 2) {
            lastDay = "28"
        } else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            lastDay = "31"
        } else {
            lastDay = "30"
        }

        return date = `${lastDay}/${month > 9 ? month : "0" + month}/${year}`; 
    }

    public static lastDayCurrMonth(date: any): any {
        let currDate = new Date();
        let year = currDate.getFullYear();
        let month = currDate.getMonth()+ 1;
        let lastDay = '';
        if (month === 2 && year % 4 === 0) {
            lastDay = "29"
        } else if (month === 2) {
            lastDay = "28"
        } else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            lastDay = "31"
        } else {
            lastDay = "30"
        }

        return date = lastDay; 
    }

    public static lastDayMonth(date: any, month: any): any {
        let currDate = new Date();
        let year = currDate.getFullYear();
        // let month = currDate.getMonth()+ 1;
        let lastDay = '';
        if (month === 2 && year % 4 === 0) {
            lastDay = "29"
        } else if (month === 2) {
            lastDay = "28"
        } else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            lastDay = "31"
        } else {
            lastDay = "30"
        }

        return date = lastDay; 
    }

    public static convertDate(value: any) {
        var event = new Date(value);
        let date = JSON.stringify(event)
        date = date.slice(1, 11)
        return date
    }

    public static pad(d: any) {
        return d < 10 ? '0' + d : d;
    }
    public static checkLengthCodeEmployee(value: any) {

        try {
            if (value.length > 5) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return true;
        }

    }

    public static cardNumber(value: any) {

        const numberString = value.toString();
        if (numberString.length == 9 || numberString.length == 12) {
            return true;
        }
        else {
            return false;
        }
    }


    public static checkLengthCode(value: any) {

        try {
            if (value.length >= 8) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return true;
        }

    }
    public static checkSpaceCode(value: any) {
        // var format = /^\S+$/; \s+
        var format = /\s+/;
        return format.test(value);
    }

    public static checkSpace(value: any) {
        var format = /\S/;
        return format.test(value);
    }

    public static checkUnsignedCode(value: any) {
        const unaccented = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return value !== unaccented;
    }

    public static checkNumber(value: any) {
        const parsedNumber = parseFloat(value);
        if (!isNaN(parsedNumber)) {
            return true;
        } else {
            return false;
        }
    }
    // Chuyển đổi độ từ độ sang radian
    public static deg2rad(deg: any) {
        return deg * (Math.PI / 180);
    }

    // Hàm tính khoảng cách giữa hai tọa độ GPS bằng công thức Haversine
    public static haversine(lat1: any, lon1: any, lat2: any, lon2: any) {
        // Chuyển đổi độ sang radian
        lat1 = this.deg2rad(lat1);
        lon1 = this.deg2rad(lon1);
        lat2 = this.deg2rad(lat2);
        lon2 = this.deg2rad(lon2);

        // Khoảng cách giữa các tọa độ
        var dlat = lat2 - lat1;
        var dlon = lon2 - lon1;

        // Công thức Haversine
        var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dlon / 2) * Math.sin(dlon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Đường kính của Trái Đất (đơn vị: km)
        var R = 6371;

        // Khoảng cách
        var distance = R * c;

        return distance;
    }


}
