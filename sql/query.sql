-- INVOICE FORMAT
CREATE OR REPLACE FUNCTION increment(i integer) RETURNS integer AS $$
    BEGIN
    	return 'INV-' || to_char(current_date, 'YYYYMMDD') || - nextval('invoice_seq');
    END;
$$ LANGUAGE plpgsql;

-- TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_purchases() RETURNS TRIGGER AS $set_purchases$
    DECLARE
    old_stock INTEGER;
    price_sum NUMERIC;
    BEGIN
        IF (TG_OP = 'INSERT') THEN
            -- UPDATE TOTAL
            
            -- UPDATE STOCK
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = NEW.itemcode;

        ELSIF (TG_OP = 'UPDATE') THEN
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode;

        ELSIF (TG_OP = 'DELETE') THEN
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
            SELECT sum(totalprice) INTO price_sum FROM purchaseitems WHERE invoice = NEW.invoice;
            UPDATE purchases SET totalprice = price_sum WHERE invoice = NEW.invoice;
            
        RETURN NULL;
    END;
$set_purchases$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchases
AFTER INSERT OR UPDATE OR DELETE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION update_purchases();