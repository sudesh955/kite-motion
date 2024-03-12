package com.rtn

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.provider.BaseColumns
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableArray

private object KeyValueEntry : BaseColumns {
	const val TABLE_NAME = "kv"
	const val COLUMN_NAME_VALUE = "value"
}

private const val SQL_CREATE_TABLE = "CREATE TABLE ${KeyValueEntry.TABLE_NAME} (" +
	"${BaseColumns._ID} TEXT PRIMARY KEY," +
	"${KeyValueEntry.COLUMN_NAME_VALUE} TEXT)"

private class KeyValueDbHelper(context: Context) :
	SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

	override fun onCreate(db: SQLiteDatabase) {
		db.execSQL(SQL_CREATE_TABLE)
	}

	override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
		onCreate(db)
	}

	companion object {
		const val DATABASE_NAME = "kv"
		const val DATABASE_VERSION = 1
	}
}

class KeyValue(context: ReactApplicationContext) : NativeKeyValueSpec(context) {
	private val dbHelper = KeyValueDbHelper(context)

	override fun exists(key: String): Boolean {
		val cursor = dbHelper.readableDatabase.query(
			KeyValueEntry.TABLE_NAME,
			arrayOf(BaseColumns._ID),
			"${BaseColumns._ID} = ?",
			arrayOf(key),
			null,
			null,
			null,
		)
		cursor.use {
			return it.moveToNext()
		}
	}

	override fun get(key: String): String? {
		val cursor = dbHelper.readableDatabase.query(
			KeyValueEntry.TABLE_NAME,
			arrayOf(KeyValueEntry.COLUMN_NAME_VALUE),
			"${BaseColumns._ID} = ?",
			arrayOf(key),
			null,
			null,
			null
		)
		with(cursor) {
			if (moveToNext()) {
				return getString(0)
			}
		}
		return null
	}

	override fun getMany(keys: ReadableArray): WritableArray {
		val cursor = dbHelper.readableDatabase.query(
			KeyValueEntry.TABLE_NAME,
			arrayOf(KeyValueEntry.COLUMN_NAME_VALUE),
			"${BaseColumns._ID} = ?",
			Array(keys.size()) { keys.getString(it) },
			null,
			null,
			null
		)
		val output = Arguments.createArray()
		with(cursor) {
			while (moveToNext()) {
				val kv = Arguments.createMap().apply {
					putString("key", cursor.getString(0))
					putString("value", cursor.getString(0))
				}
				output.pushMap(kv)
			}
		}
		return output
	}

	override fun read(
		prefix: String,
		count: Double,
		decreasing: Boolean,
		cursor: String?
	): WritableArray {
		val dbCursor = if (decreasing) {
			val queryCursor = cursor ?: "$prefix~"
			dbHelper.readableDatabase.query(
				KeyValueEntry.TABLE_NAME,
				arrayOf(BaseColumns._ID, KeyValueEntry.COLUMN_NAME_VALUE),
				"${BaseColumns._ID} < ? AND ${BaseColumns._ID} > ?",
				arrayOf(queryCursor, prefix),
				null,
				null,
				"${BaseColumns._ID} DESC",
				count.toInt().toString()
			)
		} else {
			val queryCursor = cursor ?: prefix
			dbHelper.readableDatabase.query(
				KeyValueEntry.TABLE_NAME,
				arrayOf(BaseColumns._ID, KeyValueEntry.COLUMN_NAME_VALUE),
				"${BaseColumns._ID} > ? AND ${BaseColumns._ID} < ?",
				arrayOf(queryCursor, "$prefix~"),
				null,
				null,
				BaseColumns._ID,
				count.toInt().toString()
			)
		}
		val output = Arguments.createArray()
		with(dbCursor) {
			while (moveToNext()) {
				val key = dbCursor.getString(0)
				if (key.startsWith(prefix)) {
					val kv = Arguments.createMap().apply {
						putString("key", key)
						putString("value", dbCursor.getString(1))
					}
					output.pushMap(kv)
				}
			}
		}
		return output
	}

	override fun readKeys(
		prefix: String,
		count: Double,
		decreasing: Boolean,
		after: String?
	): WritableArray? {
		val cursor = dbHelper.readableDatabase.query(
			KeyValueEntry.TABLE_NAME,
			arrayOf(BaseColumns._ID),
			"${BaseColumns._ID} > ? AND ${BaseColumns._ID} < ?",
			arrayOf(after ?: prefix, "$prefix~"),
			null,
			null,
			"${BaseColumns._ID} " + if (decreasing) "DESC" else "ASC",
			count.toInt().toString()
		)
		val output = Arguments.createArray()
		cursor.use {
			while (it.moveToNext()) {
				val key = it.getString(0)
				if (key.startsWith(prefix)) {
					output.pushString(key)
				}
			}
		}
		return output
	}

	override fun set(key: String, value: String) {
		val row = ContentValues().apply {
			put(BaseColumns._ID, key)
			put(KeyValueEntry.COLUMN_NAME_VALUE, value)
		}
		dbHelper.writableDatabase.insertWithOnConflict(
			KeyValueEntry.TABLE_NAME,
			null,
			row,
			SQLiteDatabase.CONFLICT_REPLACE,
		)
	}

	override fun setMany(items: ReadableArray) {
		// TODO: check if can be done in one query
		val db = dbHelper.writableDatabase
		db.beginTransaction()
		try {
			for (i in 0 until items.size()) {
				val item = items.getMap(i)
				val row = ContentValues().apply {
					put(BaseColumns._ID, item.getString("key"))
					put(KeyValueEntry.COLUMN_NAME_VALUE, item.getString("value"))
				}
				db.insertWithOnConflict(
					KeyValueEntry.TABLE_NAME,
					null,
					row,
					SQLiteDatabase.CONFLICT_REPLACE,
				)
			}
			db.setTransactionSuccessful()
		} finally {
			db.endTransaction()
		}
	}

	override fun remove(key: String) {
		dbHelper.writableDatabase.delete(
			KeyValueEntry.TABLE_NAME,
			"${BaseColumns._ID} = ?",
			arrayOf(key)
		)
	}

	override fun removeMany(keys: ReadableArray) {
		// TODO: use transaction
		for (i in 0 until keys.size()) {
			remove(keys.getString(i))
		}
	}

	override fun removeAll() {
		dbHelper.writableDatabase.delete(
			KeyValueEntry.TABLE_NAME,
			"1",
			arrayOf()
		)
	}
}
