-- INVOICE FORMAT
CREATE OR REPLACE FUNCTION increment(i integer) RETURNS integer AS $$
    BEGIN
    	return 'INV-' || to_char(current_timestamp, 'YYYYMMDD') || - nextval('invoice_seq');
    END;
$$ LANGUAGE plpgsql;


-- INSERT QUERY
INSERT INTO public.purchaseitems (invoice, itemcode, quantity) VALUES ('INV-20221119-1', 8850389108314, 24);

-- RESET SEQUENCE
ALTER SEQUENCE sequence_name RESTART WITH 1

-- DROP TRIGGER FUNC
DROP TRIGGER [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]


-- TRIGGER FUNCTION
-- STOCK UPDATE 
CREATE OR REPLACE FUNCTION update_purchases() RETURNS TRIGGER AS $set_purchases$
    DECLARE
    old_stock INTEGER;
    price_sum NUMERIC;
    BEGIN
        IF (TG_OP = 'INSERT') THEN
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
            UPDATE purchases SET totalsum = price_sum WHERE invoice = NEW.invoice;
            
        RETURN NULL;
    END;
$set_purchases$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchases
AFTER INSERT OR UPDATE OR DELETE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION update_purchases();


-- PRICE UPDATE
CREATE OR REPLACE FUNCTION price_update() RETURNS TRIGGER AS $set_totalprice$
    DECLARE
    itempurchaseprices NUMERIC;
    BEGIN
        SELECT purchaseprice INTO itempurchaseprices FROM goods WHERE barcode = NEW.itemcode;
        NEW.purchaseprice := itempurchaseprices;
        NEW.totalprice := NEW.quantity * itempurchaseprices;
            
        RETURN NEW;
    END;
$set_totalprice$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchases
BEFORE INSERT OR UPDATE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION price_update();