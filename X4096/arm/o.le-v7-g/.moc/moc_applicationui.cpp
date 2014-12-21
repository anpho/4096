/****************************************************************************
** Meta object code from reading C++ file 'applicationui.hpp'
**
** Created by: The Qt Meta Object Compiler version 63 (Qt 4.8.5)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "../../../src/applicationui.hpp"
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'applicationui.hpp' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 63
#error "This file was generated using the moc from 4.8.5. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
static const uint qt_meta_data_ApplicationUI[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
      16,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       2,       // signalCount

 // signals: signature, parameters, type, tag, flags
      15,   14,   14,   14, 0x05,
      32,   25,   14,   14, 0x05,

 // slots: signature, parameters, type, tag, flags
      49,   14,   14,   14, 0x08,
      75,   14,   14,   14, 0x08,
      85,   14,   14,   14, 0x08,
      98,   96,   14,   14, 0x08,

 // methods: signature, parameters, type, tag, flags
     174,  166,  158,   14, 0x02,
     210,  200,   14,   14, 0x02,
     236,   14,  158,   14, 0x02,
     255,  246,   14,   14, 0x02,
     274,   14,   14,   14, 0x02,
     294,   14,   14,   14, 0x02,
     317,  308,  158,   14, 0x02,
     339,  308,   14,   14, 0x02,
     385,  364,  359,   14, 0x02,
     421,  416,   14,   14, 0x02,

       0        // eod
};

static const char qt_meta_stringdata_ApplicationUI[] = {
    "ApplicationUI\0\0timeout()\0status\0"
    "bbmComplete(int)\0onSystemLanguageChanged()\0"
    "onArmed()\0takeshot()\0c\0"
    "onBBMregUpdated(bb::platform::bbm::RegistrationState::Type)\0"
    "QString\0key,def\0getValue(QString,QString)\0"
    "key,value\0setValue(QString,QString)\0"
    "getLang()\0fileName\0shareFile(QString)\0"
    "requestScreenshot()\0registerBBM()\0"
    "filepath\0readTextFile(QString)\0"
    "deleteFile(QString)\0bool\0filepath,filecontent\0"
    "writeTextFile(QString,QString)\0type\0"
    "play(QString)\0"
};

void ApplicationUI::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        ApplicationUI *_t = static_cast<ApplicationUI *>(_o);
        switch (_id) {
        case 0: _t->timeout(); break;
        case 1: _t->bbmComplete((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 2: _t->onSystemLanguageChanged(); break;
        case 3: _t->onArmed(); break;
        case 4: _t->takeshot(); break;
        case 5: _t->onBBMregUpdated((*reinterpret_cast< bb::platform::bbm::RegistrationState::Type(*)>(_a[1]))); break;
        case 6: { QString _r = _t->getValue((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< const QString(*)>(_a[2])));
            if (_a[0]) *reinterpret_cast< QString*>(_a[0]) = _r; }  break;
        case 7: _t->setValue((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< const QString(*)>(_a[2]))); break;
        case 8: { QString _r = _t->getLang();
            if (_a[0]) *reinterpret_cast< QString*>(_a[0]) = _r; }  break;
        case 9: _t->shareFile((*reinterpret_cast< QString(*)>(_a[1]))); break;
        case 10: _t->requestScreenshot(); break;
        case 11: _t->registerBBM(); break;
        case 12: { QString _r = _t->readTextFile((*reinterpret_cast< QString(*)>(_a[1])));
            if (_a[0]) *reinterpret_cast< QString*>(_a[0]) = _r; }  break;
        case 13: _t->deleteFile((*reinterpret_cast< QString(*)>(_a[1]))); break;
        case 14: { bool _r = _t->writeTextFile((*reinterpret_cast< QString(*)>(_a[1])),(*reinterpret_cast< QString(*)>(_a[2])));
            if (_a[0]) *reinterpret_cast< bool*>(_a[0]) = _r; }  break;
        case 15: _t->play((*reinterpret_cast< QString(*)>(_a[1]))); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData ApplicationUI::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject ApplicationUI::staticMetaObject = {
    { &QObject::staticMetaObject, qt_meta_stringdata_ApplicationUI,
      qt_meta_data_ApplicationUI, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &ApplicationUI::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *ApplicationUI::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *ApplicationUI::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_ApplicationUI))
        return static_cast<void*>(const_cast< ApplicationUI*>(this));
    return QObject::qt_metacast(_clname);
}

int ApplicationUI::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 16)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 16;
    }
    return _id;
}

// SIGNAL 0
void ApplicationUI::timeout()
{
    QMetaObject::activate(this, &staticMetaObject, 0, 0);
}

// SIGNAL 1
void ApplicationUI::bbmComplete(int _t1)
{
    void *_a[] = { 0, const_cast<void*>(reinterpret_cast<const void*>(&_t1)) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}
QT_END_MOC_NAMESPACE
